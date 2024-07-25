/** @format */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { RequestContext } from "next/dist/server/base-server";
import { verifySessionToken } from "../utils/dev";
import { error } from "console";

interface AuthMiddlewareOptions {
  protect?: string | string[];
  authenticate?: (req: NextRequest) => Promise<NextResponse>;
  redirectUrl?: string | ((req: NextRequest) => Promise<string>);
}

export function authenticate(options: AuthMiddlewareOptions) {
  return async (req: NextRequest) => {
    try {
      if (!options || !options.protect) {
        return NextResponse.next();
      }

      // Check if the route should be protected
      if (!isProtectedRoute(req.nextUrl.pathname, options.protect)) {
        console.log("Returning, not a protected route.");
        return NextResponse.next();
      }
      // Fetch the session data using axios

      const cookieSession = req.cookies.get("fluid-auth");

      if (!cookieSession) {
        return handleProtectedRoute(req, options);
      }

      /* try {
        const playload = await verifySessionToken(
          options.sessionSecret,
          cookieSession?.value
        );
      } catch (error) {
        console.log("invalid refreshToken");
      } */

      return NextResponse.next();
    } catch (error) {
      // Handle error (e.g., log it and/or return an error response)
      console.error("AuthMiddleware error:", error);
      return NextResponse.json({ message: "An error occurred" });
    }
  };
}

function isProtectedRoute(pathname: string, protect: string | string[]) {
  if (Array.isArray(protect)) {
    return protect.some((route) => pathname.startsWith(route));
  }

  return pathname.startsWith(protect);
}

async function handleProtectedRoute(
  req: NextRequest,
  options: AuthMiddlewareOptions
): Promise<NextResponse> {
  console.log("Session not found, handling authentication.");

  if (typeof options.authenticate === "function") {
    return await options.authenticate(req);
  }

  if (typeof options.redirectUrl === "function") {
    const redirectUrl = await options.redirectUrl(req);
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.redirect(new URL(options.redirectUrl || "/", req.url));
}
