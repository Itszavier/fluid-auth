/** @format */

import { NextRequest } from "next/server";
import authHandler from "./app/auth";
import { authenticate } from "./lib/middleware";

export const middleware = authenticate({
  protect: "/profile",
  redirectUrl: "/",
});

export const config = {
  /*
   * Match all paths except for:
   * 1. /api/ routes
   * 2. /_next/ (Next.js internals)
   * 3. /_static (inside /public)
   * 4. /_vercel (Vercel internals)
   * 5. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
   */
  matcher: ["/((?!api/|_next/|_static|_vercel|[\\w-]+\\.\\w+).*)"],
};
