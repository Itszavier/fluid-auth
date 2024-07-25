/** @format */

import { NextRequest, NextResponse } from "next/server";
import { BaseProvider, BaseUser } from "./base";
import { Session } from "./session";

export interface AuthHandlerConfig {
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

export interface ISession {
  user: any;
  sessionId: string;
}
