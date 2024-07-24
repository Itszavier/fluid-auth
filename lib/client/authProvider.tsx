/** @format */

"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";

import { BaseUser, BaseSessionData } from "../core/base";

interface Auth {
  user: BaseUser | null;
  expiration: Date | null;
  authenticated: boolean;
}

export interface IAuthContext {
  authenticated: boolean;
  auth: Auth;
  isLoading: boolean; // Added for loading state
  error: Error | null; // Added for error handling
}

const authContext = createContext<IAuthContext>({
  authenticated: false,
  auth: { user: null, expiration: null, authenticated: false },
  isLoading: true, // Added for loading state
  error: null, // Added for error handling
});

interface AuthProviderProps {
  children: ReactNode;
}

interface FetchData extends BaseSessionData {
  authenticated: boolean;
}

export function useAuth(): IAuthContext {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const [auth, setAuth] = useState<Auth>({
    user: null,
    expiration: null,
    authenticated: false,
  });

  const fetchAuthData = async () => {
    try {
      const response = await fetch("/api/auth/session");
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data: FetchData = await response.json();
      console.log("Fetched auth data:", data); // Debugging log
      setAuth({
        user: data.user,
        expiration: data.expiration ? new Date(data.expiration) : null,
        authenticated: data.authenticated,
      });
    } catch (error: any) {
      console.error("Fetch error:", error); // Debugging log
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("use effect run");
    fetchAuthData();
  }, []);

  return (
    <authContext.Provider
      value={{
        auth,
        authenticated: auth.authenticated,
        error: null,
        isLoading,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
