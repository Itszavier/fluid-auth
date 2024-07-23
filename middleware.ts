import { AuthMiddleware } from "@/lib/middleware";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  return AuthMiddleware(req, {
    redirectUrl: "/",
    protect: ["/profile"],
  });
}
