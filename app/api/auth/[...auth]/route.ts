/** @format */

import AuthHandler from "@/lib/AuthHandler";
import { GoogleProvider } from "@/lib/provider";
import { Session } from "@/lib/session";
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
    serializeUser: async (user) => {
      console.log("from serialize function", user);
      // store the userId to the session in the database
      return user.id;
    },

    deserializeUser: async (userId: string) => {
      // find the user in the database
      return userId;
    },
  }),
});

export function GET(req: NextRequest) {
  return authHandler.handleRequest(req);
}

export function POST(req: NextRequest) {
  return authHandler.handleRequest(req);
}
