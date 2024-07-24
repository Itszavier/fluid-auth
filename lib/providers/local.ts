import { NextRequest, NextResponse } from "next/server";
import { BaseProvider, BaseUser } from "../core/base";

export interface LocalProviderConfig {
  verify(email: string, password: string): Promise<any>;
}

export class LocalProvider extends BaseProvider {
  config: LocalProviderConfig;
  data: any;

  constructor(config: LocalProviderConfig) {
    super("local", { isOAuthProvider: false });

    this.config = config;
  }

  async handleLogin(
    req: NextRequest,
    persist: any
  ): Promise<NextResponse<unknown>> {
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({ message: "Missing email field" });
    }

    if (!body.password) {
      return NextResponse.json({ message: "Missing password field" });
    }

    try {
      const data = await this.config.verify(body.email, body.password);

      if (!data) {
        throw new Error("Invalid Credentials");
      }

      await this.persistUserToSession(data);

      if (data.redirectUrl) {
        return NextResponse.redirect(data.redirectUrl);
      }

      return NextResponse.json({ message: "Successfully logged in" });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({ message: error.message, error });
    }
  }
}
