import { NextRequest, NextResponse } from "next/server";
import { BaseProvider } from "../index";

interface LocalProviderConfig {
  verify(email: string, password: string): Promise<any>;
}

class LocalProvider extends BaseProvider {
  config: LocalProviderConfig;

  constructor(config: LocalProviderConfig) {
    super("local");

    this.config = config;
  }

  async handleLogin(req: NextRequest): Promise<NextResponse<unknown>> {
    const body = await req.json();

    if (!body.email) {
      return NextResponse.json({ message: "Missing email field" });
    }

    if (!body.password) {
      return NextResponse.json({ message: "Missing password field" });
    }

    try {
      await this.config.verify(body.email, body.password);
      return NextResponse.json({ message: "logged in with credentials" });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({ message: error.message, error });
    }
  }
}
