/** @format */

import AuthHandler from "@/auth";
import { NextRequest } from "next/server";

const authHandler = new AuthHandler({});

export function GET(req: NextRequest) {
  return authHandler.handleRequest(req);
}

export function POST(req: NextRequest) {
  return authHandler.handleRequest(req);
}
