/** @format */

import { NextRequest, NextResponse } from "next/server";
import google from "googleapis";

export class BaseProvider {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export interface GoogleProviderConfig {
  clientId: string;
  clientSecret: string;
  callback: (profile: any) => any;
}

export class GoogleProvider extends BaseProvider {
  config: GoogleProviderConfig;
  authClient: google.Common.OAuth2Client;

  constructor(config: GoogleProviderConfig) {
    super("google");

    this.config = config;

    this.authClient = new google.Auth.OAuth2Client({
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      redirectUri: `http://localhost:3000/api/auth/callback/${this.name}`,
    });
  }

  async handleLogin(req: NextRequest) {
    const scope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];

    const url = this.authClient.generateAuthUrl({ scope, access_type: "offline" });

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

      // Here, you would handle the user data, e.g., create a session, store user in DB, etc.
      // For this example, we'll just send the user data as JSON.
      const profile = response.json();

      return await this.config.callback(profile);
    } catch (error) {
      return error;
    }
  }
}
