/** @format */

import { NextRequest, NextResponse } from "next/server";

export interface Provider {
  name: string;
  handleLogin: (req: NextRequest) => Promise<NextResponse>;
  authorize: (code: string) => Promise<any | null>;
}

export interface Config {
  providers?: Provider[];
}

export default class AuthHandler {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async handleRequest(req: NextRequest): Promise<NextResponse | null> {
    const { pathname } = new URL(req.url);
    const route = pathname.trim().split("/").splice(3).join("/");

    switch (true) {
      case route === "signin":
        return await this.handleLogin(req);

      case route.startsWith("callback"):
        return await this.handleCallback(req, route);

      default:
        return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }
  }

  private async handleLogin(req: NextRequest): Promise<NextResponse | null> {
    const providerName = req.nextUrl.searchParams.get("provider");

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

      const provider = this.getProvider(providerName);
      const user = await provider.authorize(code);

  
      return NextResponse.json({ user });
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  private getProvider(name: string): Provider {
    const provider = this.config.providers?.find((provider) => provider.name === name);
    if (!provider) {
      throw new Error("Provider was not found");
    }
    return provider;
  }
}
