/** @format */

import AuthHandler from "@/auth";
import { GoogleProvider } from "@/auth/provider";
import { NextRequest } from "next/server";

const Google = new GoogleProvider({
  clientId: process.env.CLIENT_ID as string,
  clientSecret: process.env.CLIENT_SECRET as string,
  callback(profile) {
    console.log(profile);
  },
});

const authHandler = new AuthHandler({ providers: [Google] });

export function GET(req: NextRequest) {
  return authHandler.handleRequest(req);
}

export function POST(req: NextRequest) {
  return authHandler.handleRequest(req);
}
