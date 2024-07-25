/** @format */
import { NextRequest, NextResponse } from "next/server";
import { AuthHandlerConfig, IAuthMiddlewareOptions } from "./core/types";
import { Session } from "./core/session";
import { BaseProvider } from "./core/base";
import { verify } from "jsonwebtoken";
import { getProvider, getRoute, isProtectedRoute, verifySessionToken } from "./utils/dev";

let redirectUrl: string | null = null;

export class AuthHandler {
  private config: AuthHandlerConfig;

  constructor(config: AuthHandlerConfig) {
    if (!config) {
      throw new Error(
        "[AuthHandler] Config is undefined but has fields that are required "
      );
    }

    /*if (!config.origin || !config.session || !config.providers) {
      throw new Error(
        "[AuthHandler] Required field (origin | session | Providers) is missing in config"
      );
    }*/

    this.config = config;
    this.addSessionToProvider();
  }

  addSessionToProvider() {
    this.config.providers?.forEach((provider) => {
      provider._setSession(this.config.session);
    });
  }

  /**
   * Handles the login request
   * @param req - The Next.js request object
   * @returns The Next.js response object
   */

  // handlers
  private async handleLogin(req: NextRequest): Promise<NextResponse> {
    const providerName = req.nextUrl.searchParams.get("provider");
    redirectUrl = req.nextUrl.searchParams.get("redirecturl");

    if (!providerName) {
      return NextResponse.json(
        { message: "Provider was not specified" },
        { status: 400 }
      );
    }

    try {
      const provider = getProvider(providerName, this.config.providers!);
      return await provider.handleLogin(req);
    } catch (error: any) {
      console.error("Error on the login route:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  /**
   * Handles the logout request
   * @param req - The Next.js request object
   * @returns The Next.js response object
   */
  private async handleLogout(req: NextRequest): Promise<NextResponse> {
    const session = this.config.session;
    await session.deleteSession();
    return NextResponse.json({ message: "Logged out" });
  }

  /**
   * Handles the callback request
   * @param req - The Next.js request object
   * @param route - The route string
   * @returns The Next.js response object
   */

  private async handleCallback(req: NextRequest, route: string): Promise<NextResponse> {
    const providerName = route.split("/").pop();

    if (!providerName) {
      return NextResponse.json(
        { message: "Provider was not specified" },
        { status: 400 }
      );
    }

    try {
      const url = new URL(req.url);
      const code = url.searchParams.get("code");

      if (!code) {
        return NextResponse.json(
          { message: "Authorization code not provided" },
          { status: 400 }
        );
      }

      const session = this.config.session;

      const provider = getProvider(providerName, this.config.providers!);

      await provider.authorize(code);

      const redirect = redirectUrl ?? null; // Use stored redirect URL or default to "/"

      // Clear the redirect URL after use

      redirectUrl = null;

      if (redirect) {
        return NextResponse.redirect(`${origin}${redirect}`);
      }

      return NextResponse.json({
        message: `login with ${providerName} was a success`,
      });
    } catch (error: any) {
      console.error("Error on the callback route:", error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }

  /**
   * Handles the incoming request and routes it to the appropriate handler
   * @param req - The Next.js request object
   * @returns The Next.js response object
   */

  private async handleGetSession(req: NextRequest): Promise<NextResponse> {
    try {
      const user = await this.config.session.getSession();

      return NextResponse.json({ user });
    } catch (error: any) {
      console.error("Error fetching session:", error);
      return NextResponse.json({
        message: `[RequestGetSession]: ${error.message}`,
      });
    }
  }
  /**
   * @POST
   *
   * */
  async handleVerifyToken(req: NextRequest) {
    try {
      const { token }: { token?: string } = await req.json();

      if (!token) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
      }

      const sessionSecret = this.config.session.options.secret;

      const decoded = verify(token, sessionSecret, {
        algorithms: ["HS384"],
        issuer: "fluid-auth",
      });

      return NextResponse.json({ valid: true, decoded });
    } catch (error: any) {
      return NextResponse.json({ valid: false, error: error.message }, { status: 401 });
    }
  }
  /**
   * @POST
   *
   * */
  
  async handleSessionRefresh(req: NextRequest) {

  };

  private async handleGetRequest(req: NextRequest): Promise<NextResponse> {
    const route = getRoute(req);

    switch (true) {
      case route === "signin":
        return await this.handleLogin(req);
      case route === "session":
        return await this.handleGetSession(req);
      case route.startsWith("callback"):
        return await this.handleCallback(req, route);
      case route === "logout":
        return await this.handleLogout(req);
      default:
        return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }
  }

  private async handlePostRequest(req: NextRequest): Promise<NextResponse> {
    const route = getRoute(req);
    switch (true) {
      case route === "signin":
        return await this.handleLogin(req);

      case route === "verify-token":
        return await this.handleVerifyToken(req);

      default:
        return NextResponse.json(
          { message: "UnImplemented route" },
          { status: 401, statusText: "UnImplemented route" }
        );
    }
  }

  async handleRequest(req: NextRequest): Promise<NextResponse> {
    const method = req.method;

    switch (method) {
      case "GET":
        return await this.handleGetRequest(req);

      case "POST":
        return await this.handlePostRequest(req);

      default:
        return NextResponse.json({ message: "UnImplemented method" });
    }
  }

  AuthMiddleare(options: IAuthMiddlewareOptions) {
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

        const url = `${this.config.origin}/api/auth/verify-token`;

        const response = await fetch(url, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: cookieSession.value }),
        });

        if (!response.ok) {
          console.error("Failed to verify token:", response.statusText);
          return handleProtectedRoute(req, options);
        }

        const data = await response.json();

        if (data.valid) {
          return NextResponse.next();
        } else {
          return handleProtectedRoute(req, options);
        }
      } catch (error) {
        console.error("AuthMiddleware error:", error);
        return NextResponse.redirect(new URL("/error", req.url));
      }
    };
  }
}

export async function handleProtectedRoute(
  req: NextRequest,
  options: IAuthMiddlewareOptions
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
