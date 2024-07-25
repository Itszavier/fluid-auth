/** @format */

import { NextRequest } from "next/server";
import { BaseProvider } from "../core/base";

export function isProtectedRoute(path: string, patterns: (string | RegExp)[]) {
  const resualt = patterns.some((pattern) => {
    if (typeof pattern === "string") {
      return path.startsWith(pattern);
    }
    return pattern.test(path);
  });
  console.log("isroute protected", resualt, path);

  return resualt;
}

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
