/** @format */
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { BaseSession, BaseSessionStore } from "./types";

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

export class MemoryStore extends BaseSessionStore {
  constructor() {
    super();
  }

  async createSession(id: string, session: BaseSession): Promise<void> {}

  // async getSession(sessionId: string) {}

  async deleteSession(sessionId: string): Promise<void> {}
}

export class Session {
  options: ISessionOption;

  constructor(options: ISessionOption) {
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const defaultExpires = new Date(Date.now() + threeDays);

    this.options = {
      ...options,
      cookie: {
        name: options.cookie.name || "slt_v45_connect_id",
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
    const cookieStore = cookies();

    const id = randomBytes(18).toString("hex");

    const serializedUser = this.options.serializeUser
      ? await this.options.serializeUser(user) // await this.options.serializeUser(user)
      : user;

    cookieStore.set(this.options.cookie.name as string, id, {
      ...this.options.cookie,
    });
  }

  async getSession(): Promise<BaseSession | null> {
    // const sessionId = cookies().get(this.options.cookie.name as string)?.value;

    return {
      expiration: new Date(),
      user: await this.options.deserializeUser!("edwefdewfdewfdew"),
    } as BaseSession;
  }

  async deleteSession(): Promise<void> {}
}
