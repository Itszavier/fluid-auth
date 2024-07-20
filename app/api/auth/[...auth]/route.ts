/** @format */

import AuthHandler from "@/auth";
import { GoogleProvider } from "@/auth/provider";
import { Session } from "@/auth/session";
import { NextRequest } from "next/server";

const Google = new GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callback(profile) {
    return profile;
  },
});

const authHandler = new AuthHandler({
  providers: [Google],
  session: new Session({
    cookie: {},
  }),
});

export function GET(req: NextRequest) {
  return authHandler.handleRequest(req);
}

export function POST(req: NextRequest) {
  return authHandler.handleRequest(req);
}
