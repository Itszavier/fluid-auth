import { NextRequest, NextResponse } from "next/server";

function isExpired(expirationDate: string | Date): boolean {
  // Create a Date object for the current date and time
  const now = new Date();

  // Check if expirationDate is a string and create a Date object if necessary
  const expiration =
    typeof expirationDate === "string"
      ? new Date(expirationDate)
      : expirationDate;

  // Compare the current date with the expiration date
  return now > expiration;
}

type RedirectUrlFunction = (req: NextRequest) => Promise<string>;

interface IOptions {
  redirectUrl?: string | RedirectUrlFunction;
  authenticate?(req: NextRequest): Promise<NextResponse>;
  protect?: (string | RegExp)[];
}

function isProtectedRoute(path: string, patterns: (string | RegExp)[]) {
  return patterns.some((pattern) => {
    if (typeof pattern === "string") {
      return path.startsWith(pattern);
    }
    return pattern.test(path);
  });
}

export function AuthMiddleware(options: IOptions) {
  return async (req: NextRequest) => {
    const url = new URL(req.url);
    try {
      if (!options || !options.protect) {
        return NextResponse.next();
      }

      if (!isProtectedRoute(req.nextUrl.pathname, options.protect)) {
        console.log("returning");
        return NextResponse.next();
      }
      const origin = url.origin;
      console.log(origin);
      const response = await fetch(`${origin}/api/auth/session`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch session ${response.statusText}`);
      }

      const session = await response.json();
      console.log("session form auth middleware", session);
      // Handle case where there is no session
      if (!session) {
        console.log("runing method");
        if (typeof options.authenticate === "function") {
          return await options.authenticate(req);
        }

        if (typeof options.redirectUrl === "function") {
          const redirectUrl = await options.redirectUrl(req);
          return NextResponse.redirect(new URL(redirectUrl, req.url));
        }

        return NextResponse.redirect(
          new URL(options.redirectUrl || "/", req.url)
        );
      }

      // Check if session has expired
      //  const expirationDate = new Date(session.expiration);
      //  if (isExpired(expirationDate)) {
      //console.log("Session expired, handling cleanup...");
      // Delete expired session here
      // For example, clear the session cookie or call a session removal service
      //}

      // Continue with the request if the session is valid
      return NextResponse.next();
    } catch (error) {
      // Handle error (e.g., log it and/or return an error response)
      console.error("AuthMiddleware error:", error);
      throw error;
    }
  };
}
