import { NextRequest, NextResponse } from "next/server";
import { BaseProvider } from "./base";
import { Session } from "./session";

export interface AuthHandlerConfig {
  /**
   * Your application domain/url
   */
  origin: string;
  providers?: BaseProvider[];
  session: Session;
}

type RedirectUrlFunction = (req: NextRequest) => Promise<string>;


export interface AuthMiddlewareOptions {
  redirectUrl?: string | RedirectUrlFunction;
  authenticate?(req: NextRequest): Promise<NextResponse>;
  protect?: (string | RegExp)[];
}
