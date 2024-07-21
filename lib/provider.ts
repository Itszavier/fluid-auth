/** @format */

import { NextRequest, NextResponse } from "next/server";
import { Auth, Common } from "googleapis";
import { BaseProvider } from "./types";
import { getBaseUrl } from "./helpers";

export interface GoogleProviderConfig {
  clientId: string;
  clientSecret: string;
  callback: (profile: any) => any;
}

export class GoogleProvider extends BaseProvider {
  config: GoogleProviderConfig;
  authClient: Common.OAuth2Client;
  private redirectUrl = "/";

  constructor(config: GoogleProviderConfig) {
    super("google");

    this.config = config;

    this.authClient = new Auth.OAuth2Client({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
    });
  }

  async handleLogin(req: NextRequest) {
    const redirectUrl = req.nextUrl.searchParams.get("redirecturl") || "/";
    console.log("redirect url", redirectUrl);
    const scope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    const redirect_uri = `https://legendary-space-system-rxrrjj5jwq5fpg5v-3000.app.github.dev/api/auth/callback/${this.name}`;

    console.log(redirect_uri);
    
    const url = this.authClient.generateAuthUrl({
      scope,
      access_type: "offline",
      redirect_uri,
    });

    return NextResponse.redirect(url);
  }

  async authorize(code: string) {
    try {
      const { tokens } = await this.authClient.getToken(code);

      console.log(tokens);
      this.authClient.setCredentials(tokens);

      const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      if (!response.ok) {
        console.log(await response.json());
        throw new Error("something went wrong");
      }

      // Here, you would handle the user data, e.g., create a session, store user in DB, etc.
      // For this example, we'll just send the user data as JSON.
      const profile = await response.json();

      return await this.config.callback(profile);
    } catch (error) {
      return error;
    }
  }
}
