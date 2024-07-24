/** @format */
import { cookies } from "next/headers";
import { BaseSessionData, BaseSessionStore, BaseUser } from "./base";
import { MemoryStore } from "./memoryStore";
import { randomBytes } from "crypto";

export interface ISessionOption {
  store?: BaseSessionStore;
  cookie: {
    name?: string;
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "strict" | "lax" | "none";
  };
  serializeUser?: (user: any) => Promise<any>;
  deserializeUser?: (userData: any) => Promise<any>;
}

export class Session {
  options: ISessionOption;
  store = new MemoryStore();

  constructor(options: ISessionOption) {
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const defaultExpires = new Date(Date.now() + threeDays);

    this.options = {
      ...options,
      cookie: {
        name: "auth",
        expires: defaultExpires,
        sameSite: "strict",
        secure: true,
        path: options.cookie.path,
        domain: options.cookie.domain,
        maxAge: options.cookie.maxAge,
      },
    };
  }

  async createSession(user: any): Promise<void> {
    const id = randomBytes(18).toString("hex");

    const serializedUser = this.options.serializeUser
      ? await this.options.serializeUser(user) // await this.options.serializeUser(user)
      : user;

    cookies().set("auth", id, {
      ...this.options.cookie,
    });

    this.store.saveSession(id, {
      expiration: new Date(),
      user: serializedUser,
    });
  }

  async getSession(): Promise<BaseSessionData | null> {
    const sessionId = cookies().get("auth")?.value;
    console.log("sessionID: ", sessionId);

    const session = await this.store.getSession(sessionId as string);

    if (session && this.options.deserializeUser) {
      session.user = await this.options.deserializeUser(session.user);
    }

    console.log("getSession", session);
    return session;
  }

  async deleteSession(): Promise<void> {
    const sessionId = cookies().get("auth")?.value;

    console.log("deleting session with ID", sessionId);

    if (cookies().has("auth")) {
      console.log("deleted auth cookie");
      cookies().delete("auth");
    }

    if (!sessionId) {
      console.log("failed to delete session id is null or undefined", sessionId);
      return;
    }

    await this.store.deleteSession(sessionId);
  }
}
