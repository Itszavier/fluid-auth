/** @format */

import { NextResponse, NextRequest } from "next/server";

export function GET(req: NextRequest) {
  return NextResponse.json({
    message: "api routes",
  });
}
