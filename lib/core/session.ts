/** @format */
import { cookies } from "next/headers";
import { BaseSessionData, BaseSessionStore, BaseUser } from "./base";
import { MemoryStore } from "./memoryStore";
import { randomBytes } from "crypto";
interface Cookie {
  name?: string;
  maxAge?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}
interface ISessionOption {
  store?: BaseSessionStore;
  cookie?: Cookie;
  serializeUser?: (user: any) => Promise<any>;
  deserializeUser?: (userData: any) => Promise<any>;
}

export class Session {
  options: ISessionOption;
  store = new MemoryStore();

  constructor(options: ISessionOption) {
    const expiresIn80Days = 80 * 24 * 60 * 60 * 1000;

    this.options = {
      ...options,
      cookie: defineDefualtCookie(
        "fluid-auth-Sessionid",
        new Date(Date.now() + expiresIn80Days),
        options.cookie
      ),
    };
  }

  async createSession(user: any): Promise<void> {
    this.store.cleanExpiredSessions();

    const cookieName = this.options.cookie?.name as string;

    const id = randomBytes(18).toString("hex");

    const serializedUser = this.options.serializeUser
      ? await this.options.serializeUser(user) // await this.options.serializeUser(user)
      : user;

    cookies().set(cookieName, id, {
      ...this.options.cookie,
    });

    this.store.saveSession(id, {
      expiration: new Date(),
      user: serializedUser,
    });
  }

  async getSession(): Promise<BaseSessionData | null> {
    await this.store.cleanExpiredSessions();
    const cookieName = this.options.cookie?.name as string;
    const sessionId = cookies().get(cookieName)?.value;
    console.log("sessionID: ", sessionId);

    const session = await this.store.getSession(sessionId as string);

    if (session && this.options.deserializeUser) {
      session.user = await this.options.deserializeUser(session.user);
    }

    console.log("getSession", session);
    return session;
  }

  async deleteSession(): Promise<void> {
    const cookieName = this.options.cookie?.name as string;
    const sessionId = cookies().get(cookieName)?.value;

    console.log("deleting session with ID", sessionId);

    if (cookies().has(cookieName)) {
      console.log("deleted auth cookie");
      cookies().delete(cookieName);
    }

    if (!sessionId) {
      console.log("failed to delete session id is null or undefined", sessionId);
      return;
    }

    await this.store.deleteSession(sessionId);
  }
}

function defineDefualtCookie(name: string, expiration: Date, config?: Cookie) {
  const options: Cookie = {
    name: config?.name ?? name,
    httpOnly: config?.httpOnly ?? true,
    sameSite: config?.sameSite ?? "strict",
    secure:false,
    expires: config?.expires ?? expiration,
    ...config, // This will overwrite defaults with provided config values
  };

  return options;
}
