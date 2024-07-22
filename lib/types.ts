/** @format */
import { NextRequest, NextResponse } from "next/server";
import { Session } from "./session";
import { ValueOf } from "next/dist/shared/lib/constants";

export interface Provider {
  name: string;
  handleLogin: (req: NextRequest) => Promise<NextResponse>;
  authorize: (code: string) => Promise<any | null>;
}

export interface AuthHandlerConfig {
  /**
   * Your application domain/url
   */
  origin: string;
  providers?: Provider[];
  session: Session;
}

export type BaseUser = any;

export interface BaseSession<User = BaseUser> {
  id: string;
  expires: Date;
  maxAge?: number;
  user: User;
  [key: string]: any;
}

/**
 * Sole responsibility for interacting with the sessions in a database.
 */
export abstract class BaseSessionStore {
  constructor() {}

  /**
   * Creates and stores a session in the database.
   *
   * @param {BaseSession} session - The session to be created and stored.
   * @returns {Promise<void | Error>} A promise that resolves to void or throws an error.
   */
  async createSession(session: BaseSession): Promise<void | Error> {
    throw new Error("Function not implemented");
  }

  /**
   * Retrieves a session from the database.
   *
   * @param {string} sessionId - The ID of the session to retrieve.
   * @returns {Promise<BaseSession | null>} A promise that resolves to the session if found, or null if not found.
   */
  async getSession(sessionId: string): Promise<BaseSession | null> {
    throw new Error("Function not implemented");
  }

  /**
   * Deletes a session from the database.
   *
   * @param {string} sessionId - The ID of the session to delete.
   * @returns {Promise<void>} A promise that resolves when the session has been deleted.
   */
  async deleteSession(sessionId: string): Promise<void> {
    throw new Error("Function not implemented");
  }
}

/**
 * Abstract class representing a base authentication provider.
 */
export abstract class BaseProvider {
  name: string;

  /**
   * Creates a new instance of BaseProvider.
   * @param {string} name - The name of the provider (used to deside which provide should be called) .
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Handles the login request.
   * @param {NextRequest} req - The incoming request.
   * @returns {Promise<NextResponse>} - A promise that resolves to the response.
   * @throws {Error} If the method is not implemented.
   */
  handleLogin(req: NextRequest): Promise<NextResponse> {
    throw new Error("handleLogin function not implemented");
  }

  /**
   * Authorizes the user using the provided code.
   * @param {string} code - The authorization code.
   * @returns {Promise<any | null>} - A promise that resolves to the user data or null.
   * @throws {Error} If the method is not implemented.
   */

  async authorize?(code: string): Promise<null | any> {}
}
