import { NextRequest, NextResponse } from "next/server";
import { Session } from "./session";

export type BaseUser = any;

export interface BaseSessionData<User = BaseUser> {
  expiration: Date;
  maxAge?: number;
  user: User;
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
  async saveSession(
    id: string,
    session: BaseSessionData
  ): Promise<void | Error> {
    throw new Error("Function not implemented");
  }

  /**
   * Retrieves a session from the database.
   *
   * @param {string} sessionId - The ID of the session to retrieve.
   * @returns {Promise<BaseSession | null>} A promise that resolves to the session if found, or null if not found.
   */
  async getSession(sessionId: string): Promise<BaseSessionData | null> {
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

export interface BaseProviderRunConfig {
  isOAuthProvider: boolean;
}
/**
 * Abstract class representing a base authentication provider.
 */
export abstract class BaseProvider {
  name: string;
  runConfig: BaseProviderRunConfig;
  private session: Session | null = null;
  /**
   * Creates a new instance of BaseProvider.
   * @param {string} name - The name of the provider (used to deside which provide should be called) .
   */
  constructor(name: string, runConfig: BaseProviderRunConfig) {
    this.name = name;
    this.runConfig = runConfig;
    console.log(this.session);
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
   */

  async authorize(code: string): Promise<null | any> {}

  /**
   * This function should not be used to set the session; it is automatically used behind the scenes.
   * @param session - The session to be set.
   */
  _setSession(session: Session) {
    this.session = session;
  }

  /**
   * creates a new session and Adds the user to the session.
   * This method should be used to include user information into the  session.
   * @param userData - The user data to add to the session.
   * @returns The updated session object with the user data included.
   */
  async persistUserToSession(userData: any): Promise<void> {
    // Initialize the session if it does not already exist
    if (!this.session) {
      throw new Error(
        "Failed to find session object. Please make sure you have configured the session correctly."
      );
    }
    const newSession = await this.session!.createSession(userData);
    console.log(`updated session ${this.session}`);
  }
}

