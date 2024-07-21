/** @format */

import { NextRequest, NextResponse } from "next/server";
import { Provider, AuthHandlerConfig } from "./types";

let redirectUrl: string | null = null;

export default class AuthHandler {
  private config: AuthHandlerConfig;

  constructor(config: AuthHandlerConfig) {
    this.config = config;
  }

  private async handleLogin(req: NextRequest): Promise<NextResponse | null> {
    const providerName = req.nextUrl.searchParams.get("provider");

    redirectUrl = req.nextUrl.searchParams.get("redirecturl");

    if (!providerName) {
      return NextResponse.json(
        { message: "Provider was not specified" },
        { status: 400 }
      );
    }

    try {
      const provider = this.getProvider(providerName);
      return await provider.handleLogin(req);
    } catch (error: any) {
      console.log("error on the login router");
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  private async handleLogout(req: NextRequest) {
    const session = this.config.session;

    await session.deleteSession();

    return NextResponse.json({ message: "Logged out" });
  }

  private async handleCallback(
    req: NextRequest,
    route: string
  ): Promise<NextResponse | null> {
    const providerName = route.split("/").pop();

    if (!providerName) {
      return NextResponse.json(
        { message: "Provider was not specified" },
        { status: 400 }
      );
    }

    try {
      const url = new URL(req.url);
      const code = url.searchParams.get("code");

      if (!code) {
        return NextResponse.json(
          { message: "Authorization code not provided" },
          { status: 400 }
        );
      }
      const session = this.config.session;
      const provider = this.getProvider(providerName);
      const user = await provider.authorize(code);

      await session.createSession(user);
      const redirect = redirectUrl; // Use stored redirect URL or default to "/"

      // Clear the redirect URL after use
      redirectUrl = null;

      return NextResponse.json({ redirect: `${this.getBaseUrl(req)}/${redirect}` });
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  private getBaseUrl(req: NextRequest): string {
    const { nextUrl } = req;
    const protocol = nextUrl.protocol; // Usually 'http:' or 'https:'
    const hostname = nextUrl.hostname; // The domain (e.g., 'example.com')
    const port = nextUrl.port ? `:${nextUrl.port}` : ""; // Port if specified

    // Construct the base URL
    return `${protocol}//${hostname}${port}`;
  }

  private getProvider(name: string): Provider {
    const provider = this.config.providers?.find((provider) => provider.name === name);
    if (!provider) {
      throw new Error("Provider was not found");
    }
    return provider;
  }

  async handleRequest(req: NextRequest): Promise<NextResponse | null> {
    const { pathname } = new URL(req.url);
    const route = pathname.trim().split("/").splice(3).join("/");

    switch (true) {
      case route === "signin":
        return await this.handleLogin(req);
      case route.startsWith("callback"):
        return await this.handleCallback(req, route);
      case route === "logout":
        return await this.handleLogout(req);
      default:
        const session = await this.config.session.getSession();
        if (session) {
          return NextResponse.json({ user: session.user, session });
        }
        return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }
  }
}
