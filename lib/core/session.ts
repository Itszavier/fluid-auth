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
        name: options.cookie.name || "auth",
        expires: options.cookie.expires || defaultExpires,
        sameSite: options.cookie.sameSite || "strict",
        httpOnly: options.cookie.httpOnly ?? true,
        secure: options.cookie.secure ?? true,
        path: options.cookie.path,
        domain: options.cookie.domain,
        maxAge: options.cookie.maxAge,
      },
    };
  }

  async createSession(user: any): Promise<void> {
    console.log("create session", user);
    const cookieStore = cookies();

    const id = randomBytes(18).toString("hex");

    const serializedUser = this.options.serializeUser
      ? await this.options.serializeUser(user) // await this.options.serializeUser(user)
      : user;

    cookieStore.set(this.options.cookie.name as string, id, {
      ...this.options.cookie,
    });

    console.log(this.store.data);
  }

  async getSession(): Promise<BaseSessionData | null> {
    const sessionId = cookies().get(this.options.cookie.name as string)?.value;
    console.log("sessionID: ", sessionId);
    const session = await this.store.getSession(sessionId as string);
    console.log("getSession", session);
    return {
      expiration: new Date(),
      user: await this.options.deserializeUser!("edwefdewfdewfdew"),
    } as BaseSessionData;
  }

  async deleteSession(): Promise<void> {}
}
