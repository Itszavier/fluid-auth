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
  private sessionStore: Map<string, BaseSession>;

  constructor() {
    super();
    this.sessionStore = new Map();
  }

  async createSession(session: BaseSession): Promise<void> {
    this.sessionStore.set(session.id, session);
  }

  async getSession(sessionId: string): Promise<BaseSession | null> {
    return this.sessionStore.get(sessionId) || null;
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessionStore.delete(sessionId);
  }
}

export class Session {
  private options: ISessionOption;
  private store: BaseSessionStore;

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

    this.store = this.options.store || new MemoryStore();
  }

  async createSession(user: any): Promise<void> {
    const cookieStore = cookies();

    const id = randomBytes(18).toString("hex");

    const serializedUser = this.options.serializeUser
      ? await this.options.serializeUser(user) // await this.options.serializeUser(user)
      : user;

    await this.store.createSession({
      id,
      expires: this.options.cookie.expires as Date,
      user: serializedUser,
    });

    cookieStore.set(this.options.cookie.name as string, id, {
      ...this.options.cookie,
      maxAge: this.options.cookie.maxAge,
      expires: this.options.cookie.expires,
    });

    console.log("create session", user);
  }

  async getSession(): Promise<BaseSession | null> {
    const sessionId = cookies().get(this.options.cookie.name as string)?.value;

    if (!sessionId) {
      return null;
    }

    const session = await this.store.getSession(sessionId);

    if (session && this.options.deserializeUser) {
      session.user = await this.options.deserializeUser(session.user);
    }

    return session;
  }

  async deleteSession(): Promise<void> {
    const sessionId = cookies().get(this.options.cookie.name as string)?.value;

    if (!sessionId) {
      return;
    }

    await this.store.deleteSession(sessionId);
  }
}
