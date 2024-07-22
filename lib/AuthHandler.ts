/** @format */

import { NextRequest, NextResponse } from "next/server";
import { AuthHandlerConfig, BaseProvider } from "./types";

let redirectUrl: string | null = null;

export class AuthHandler {
  private config: AuthHandlerConfig;

  constructor(config: AuthHandlerConfig) {
    if (!config) {
      throw new Error(
        "[AuthHandler] Config is undefined but has fields that are required "
      );
    }

    /*if (!config.origin || !config.session || !config.providers) {
      throw new Error(
        "[AuthHandler] Required field (origin | session | Providers) is missing in config"
      );
    }*/

    this.config = config;
    this.addSessionToProvider();
  }

  addSessionToProvider() {
    this.config.providers?.forEach((provider) => {
      provider._setSession(this.config.session);
    });
  }

  /**
   * Handles the login request
   * @param req - The Next.js request object
   * @returns The Next.js response object
   */

  private async handleLogin(req: NextRequest): Promise<NextResponse> {
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
      console.error("Error on the login route:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  /**
   * Handles the logout request
   * @param req - The Next.js request object
   * @returns The Next.js response object
   */
  private async handleLogout(req: NextRequest): Promise<NextResponse> {
    const session = this.config.session;
    await session.deleteSession();
    return NextResponse.json({ message: "Logged out" });
  }

  /**
   * Handles the callback request
   * @param req - The Next.js request object
   * @param route - The route string
   * @returns The Next.js response object
   */

  private async handleCallback(
    req: NextRequest,
    route: string
  ): Promise<NextResponse> {
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
      const user = await provider.authorize!(code);

      await session.createSession(user);

      const redirect = redirectUrl ?? null; // Use stored redirect URL or default to "/"

      // Clear the redirect URL after use

      redirectUrl = null;

      if (redirect) {
        return NextResponse.redirect(`${origin}${redirect}`);
      }

      return NextResponse.json({
        message: `login with ${providerName} was a success`,
      });
    } catch (error: any) {
      console.error("Error on the callback route:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  /**
   * Retrieves the provider by name from the config
   * @param name - The name of the provider
   * @returns The provider object
   */

  private getProvider(name: string): BaseProvider {
    const provider = this.config.providers?.find(
      (provider) => provider.name === name
    );
    if (!provider) {
      throw new Error("Provider was not found");
    }
    return provider as BaseProvider;
  }

  private getRoute(req: NextRequest) {
    const { pathname } = new URL(req.url);
    const route = pathname.trim().split("/").splice(3).join("/");

    return route;
  }

  /**
   * Handles the incoming request and routes it to the appropriate handler
   * @param req - The Next.js request object
   * @returns The Next.js response object
   */

  private async handleGetRequest(req: NextRequest): Promise<NextResponse> {
    const route = this.getRoute(req);

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

  private async handlePostRequest(req: NextRequest): Promise<NextResponse> {
    const route = this.getRoute(req);
    switch (route) {
      case "signin":
        return await this.handleLogin(req);
      default:
        return NextResponse.json(
          { message: "UnImplemented route" },
          { status: 401, statusText: "UnImplemented route" }
        );
    }
  }

  async handleRequest(req: NextRequest): Promise<NextResponse> {
    const method = req.method;

    switch (method) {
      case "GET":
        return await this.handleGetRequest(req);
      case "POST":
        return await this.handlePostRequest(req);
      default:
        return NextResponse.json({ message: "UnImplemented method" });
    }
  }
}
