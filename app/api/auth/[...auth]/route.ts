/** @format */

import AuthHandler from "@/auth/AuthHandler";
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

const sessionManager = new Session({
  cookie: {},
  serializeUser: async (user) => {
    console.log("from serialize function", user);
    return user.id;
  },
});
const authHandler = new AuthHandler({
  providers: [Google],
  session: sessionManager,
});

export function GET(req: NextRequest) {
  return authHandler.handleRequest(req);
}

export function POST(req: NextRequest) {
  return authHandler.handleRequest(req);
}
