/** @format */
import { NextRequest, NextResponse } from "next/server";
import { Session } from "./session";
export type BaseUser = any;

export interface Provider {
  name: string;
  handleLogin: (req: NextRequest) => Promise<NextResponse>;
  authorize: (code: string) => Promise<any | null>;
}

export interface AuthHandlerConfig {
  providers?: Provider[];
  redirect?: boolean;
  session: Session;
}
