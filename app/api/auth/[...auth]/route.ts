/** @format */

import { AuthHandler } from "@/lib/AuthHandler";
import { GoogleProvider, LocalProvider } from "@/lib/providers";
import { Session } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const user = {
  id: "fewffewfewfewffwfewfwefew",
  name: "Imani Brown",
  email: "imanibrown421@gmail.com",
  password: "test",
};

const Local = new LocalProvider({
  async verify(email, password) {
    if (email !== user.email && password !== user.password) {
      throw Error("Invalid Email or password");
    }

    return user;
  },
});

const Google = new GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callback(profile) {
    return profile;
  },
});

const authHandler = new AuthHandler({
  providers: [Local],
  origin: process.env.ORIGIN as string,
  session: new Session({
    cookie: {},
    serializeUser: async (user) => {
      console.log("from serialize function", user);
      // store the userId to the session in the database
      return user.id;
    },

    deserializeUser: async (userId: string) => {
      // find the user in the database
      return user;
    },
  }),
});

export function GET(req: NextRequest) {
  return authHandler.handleRequest(req);
}

export function POST(req: NextRequest) {
  return authHandler.handleRequest(req);
}
