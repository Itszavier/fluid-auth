/** @format */

import { AsyncResource } from "async_hooks";
import { cookies } from "next/headers";
import { ResponseCooki } from "next/server";
import ShortUniqueId from "short-unique-id";

const sessionStore = new Map<string, Session>();

interface SessionOption {
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
}

class Session {
  options: SessionOption;
  constructor(options: SessionOption) {
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const expires = new Date(Date.now() + threeDays);

    this.options = {
      ...options,
      cookie: {
        name: options.cookie.name || "slt_v45_connect_id",
        expires: options.cookie.expires || expires,
        sameSite: options.cookie.sameSite || "strict",
        httpOnly: options.cookie.httpOnly || true,
        secure: options.cookie.httpOnly || true,
      },
    };
  }

  async createSession(data: any) {
    const cookieStore = cookies();

    const { randomUUID } = new ShortUniqueId();

    const id = randomUUID(18);

    cookieStore.set(this.options.cookie.name as string, id, this.options.cookie);
  }

  async getSession() {}

  async deleteSession() {}
}

interface Session {
  id: string;
  expires: Date;
  maxAge?: number;
}

class MemoryStore {
  sessionStore: Map<string, Session>;

  constructor() {
    this.sessionStore = new Map();
  }

  async createSession(session: Session): Promise<any> {
    this.sessionStore.set(session.id, session);
  }
}
