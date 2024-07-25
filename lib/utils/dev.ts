/** @format */

import { NextRequest, NextResponse } from "next/server";
import { BaseProvider } from "../core/base";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { ISession, IAuthMiddlewareOptions } from "../core/types";

export function getProvider(name: string, providers: BaseProvider[]): BaseProvider {
  const provider = providers.find((provider) => provider.name === name);
  if (!provider) {
    throw new Error("Provider was not found");
  }
  return provider as BaseProvider;
}

export function getRoute(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const route = pathname.trim().split("/").splice(3).join("/");

  return route;
}

export async function createSessionToken(
  secret: string,
  playload: ISession,
  expiration: number
) {
  const token = sign(playload, secret, {
    algorithm: "HS384",
    issuer: "fluid-auth",
    expiresIn: expiration,
  });

  return token;
}

export async function verifySessionToken(token: string, secret: string) {
  try {
    const playload = verify(token, secret, {
      algorithms: ["HS384"],
      issuer: "fluid-auth",
    }) as JwtPayload;

    return playload;
  } catch (error: any) {
    console.error("Failed to verify token:", error.message);
    return null;
  }
}

export function isProtectedRoute(pathname: string, protect: string | string[]) {
  if (Array.isArray(protect)) {
    return protect.some((route) => pathname.startsWith(route));
  }

  return pathname.startsWith(protect);
}

