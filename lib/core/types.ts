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

export interface ISession {
  user: any;
  sessionId: string;
}

export interface IAuthMiddlewareOptions {
  protect?: string | string[];
  authenticate?: (req: NextRequest) => Promise<NextResponse>;
  redirectUrl?: string | ((req: NextRequest) => Promise<string>);
}
