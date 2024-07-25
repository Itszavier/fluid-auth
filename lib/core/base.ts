/** @format */

import { NextRequest, NextResponse } from "next/server";

import { Session } from "./session";

export type BaseUser = any;

export interface BaseSessionData {
  expiries: Date;
  userId: string;
  sessionId: string;
  [key: string]: any;
}

export abstract class BaseSessionStore {
  constructor() {}

  /**
   * Creates and stores a session in the database.
   *
   * @param {BaseSession} session - The session to be created and stored.
   * @returns {Promise<void | Error>} A promise that resolves to void or throws an error.
   */
  abstract saveSession?(session?: any): Promise<void | Error>;

  /**
   * Retrieves a session from the database.
   *
   * @param {string} sessionId - The ID of the session to retrieve.
   * @returns {Promise<BaseSession | null>} A promise that resolves to the session if found, or null if not found.
   */
  abstract getSession?(sessionId: string): Promise<BaseSessionData | null>;

  /**
   * Deletes a session from the database.
   *
   * @param {string} sessionId - The ID of the session to delete.
   * @returns {Promise<void>} A promise that resolves when the session has been deleted.
   */
  abstract deleteSession?(sessionId: string): Promise<void>;

  /***
   * Abstract method to clean expired sessions.
   * Implementations should define how expired sessions are cleaned.
   */
  abstract cleanExpiredSessions?(): Promise<void>;
}

export interface BaseProviderRunConfig {
  isOAuthProvider: boolean;
}
/**
 * Abstract class representing a base authentication provider.
 */
export abstract class BaseProvider {
  name: string;
  runConfig: BaseProviderRunConfig;
  protected _session: Session | null = null;

  /**
   * Creates a new instance of BaseProvider.
   * @param {string} name - The name of the provider (used to deside which provide should be called) .
   */
  constructor(name: string, runConfig: BaseProviderRunConfig) {
    this.name = name;
    this.runConfig = runConfig;
  }

  /**
   * Handles the login request.
   * @param {NextRequest} req - The incoming request.
   * @returns {Promise<NextResponse>} - A promise that resolves to the response.
   */

  abstract handleLogin(req: NextRequest): Promise<NextResponse>;

  /**
   * Authorizes the user using the provided code.
   * @param {string} code - The authorization code.
   * @returns {Promise<any | null>} - A promise that resolves to the user data or null.
   */

  async authorize(code: string): Promise<void> {}

  /**
   * This function should not be used to set the session; it is automatically used behind the scenes.
   * @param session - The session to be set.
   */
  _setSession(session: Session) {
    this._session = session;
  }

  /**
   * creates a new session and Adds the user to the session.
   * This method should be used to include user information into the  session.
   * @param userData - The user data to add to the session.
   * @returns The updated session object with the user data included.
   */
  async persistUserToSession(userData: any): Promise<void> {
    // Initialize the session if it does not already exist
    console.log(`[BaseProvider] Persisting user to session. User data:`, userData);

    // Initialize the session if it does not already exist
    if (!this._session) {
      console.error(
        `[BaseProvider] Failed to find session object. Please make sure you have configured the session correctly.`
      );
      throw new Error(
        "Failed to find session object. Please make sure you have configured the session correctly."
      );
    }
    try {
      console.log(`[BaseProvider] Creating session for user with data:`, userData);

      await this._session.createSession(userData);

      console.log(`[BaseProvider] Updated session for user `);
    } catch (error: any) {
      console.error(
        `[BaseProvider] Error persisting user to session: ${error.message}`,
        error
      );
      throw error;
    }
  }
}
