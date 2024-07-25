/** @format */
import { cookies } from "next/headers";
import { BaseSessionData, BaseSessionStore, BaseUser } from "./base";
import { randomBytes } from "crypto";
import { createSessionToken, verifySessionToken } from "../utils/dev";
import { decode, JwtPayload } from "jsonwebtoken";
import { ISession } from ".";

interface Cookie {
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}
interface ISessionOption {
  store?: BaseSessionStore;
  cookie?: Cookie;
  secret: string;
  name?: string;
  serializeUser: (data: any) => unknown;
  deserializeUser: (data: any) => BaseUser;
}

export class Session {
  options: ISessionOption;
  store?: BaseSessionStore;

  constructor(options: ISessionOption) {
    const expiresIn80Days = 80 * 24 * 60 * 60 * 1000;

    this.options = {
      ...options,
      cookie: defineDefualtCookie(options.cookie),
    };
    this.store = this.options.store;
  }

  async createSession(data: any): Promise<void> {
    try {
      // this.store.cleanExpiredSessions();
      const cookie = cookies();
      const expirationDate = Date.now() * 80 * 60 * 1000;
      const sessionId = randomBytes(18).toString("hex");
      const sessionSecret = this.options.secret;
      const user: any = this.options.serializeUser(data);

      const token = await createSessionToken(
        sessionSecret,
        { user, sessionId: sessionId },
        expirationDate
      );

      cookie.set(this.options.name as string, token, { ...this.options.cookie });

      if (this.store?.saveSession && typeof this.store.saveSession === "function") {
        this.store.saveSession(sessionId);
      }
    } catch (error) {
      throw error;
    }
  }

  async getSession(): Promise<BaseUser | null> {
    try {
      const cookieStore = cookies();
      const cookie = cookieStore.get(this.options.name as string);

      if (!cookie) {
        console.log("[Session]: cookie was not found");
        throw new Error("[session] UnAuthorized cookie was not found");
      }

      const playload = verifySessionToken(
        cookie.value,
        this.options.secret
      ) as JwtPayload;

      return await this.options.deserializeUser(playload.user);
    } catch (error: any) {
      console.log("[Session]: session get error", error.message);
    }
  }

  async deleteSession(): Promise<void> {
    try {
      const cookie = cookies();
      
      const cookieName = this.options.name as string;

      const sessionCookie = cookie.get(cookieName);

      if (!sessionCookie) {
        return;
      }
      const docoded = decode(sessionCookie.value) as ISession;

      if (this.store?.deleteSession && typeof this.store.deleteSession === "function") {
        await this.store.deleteSession(sessionCookie.value);
      }

      cookie.delete(cookieName);
    } catch (error) {
      throw error;
    }
  }
}

function defineDefualtCookie(config?: Cookie) {
  const options: Cookie = {
    httpOnly: config?.httpOnly ?? true,
    sameSite: config?.sameSite ?? "strict",
    secure: config?.secure ?? true,
    ...config, // This will overwrite defaults with provided config values
  };

  console.log("cookie options:", options);

  return options;
}
