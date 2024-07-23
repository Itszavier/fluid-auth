/** @format */

import authhandler from "@/app/auth";
import { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  return authhandler.handleRequest(req);
}

export function POST(req: NextRequest) {
  return authhandler.handleRequest(req);
}
