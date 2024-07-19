/** @format */

import { NextRequest, NextResponse } from "next/server";

export interface Config {
  providers?: any[];
}

export default class AuthHandler {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async handleRequest(req: NextRequest): Promise<NextResponse | null> {
    const { pathname } = new URL(req.url);

    const route = pathname.trim().split("/").splice(3).join("/");

    switch (route) {
      case "signin":
        return this.handleSignin(req);
      default:
        return NextResponse.json(
          {
            message: `Route ${route} not found`,
          },
          { status: 404 }
        );
    }
  }

  async handleSignin(req: NextRequest): Promise<NextResponse | null> {
    try {
      const body = await req.json();
      return NextResponse.json({ message: "successfully signin" });
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  private getProvider(name: string) {
    const config = this.config;

    const provider = config.providers?.find((provider) => provider.name == name);

    if (!provider) {
      throw new Error("provider was not found");
    }
    return provider;
  }
}
