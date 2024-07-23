"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { BaseUser, BaseSession } from "..";

export interface IAuthContext {
  authenticated: boolean;
  user: BaseUser | null;
  session: BaseSession | null;
  isLoading: boolean; // Added for loading state
  error: Error | null; // Added for error handling
}

const authContext = createContext<IAuthContext>({
  authenticated: false,
  user: null,
  session: null,
  isLoading: true,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function useAuth(): IAuthContext {
  const context = useContext(authContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [user, setUser] = useState<BaseUser | null>(null);
  const [session, setSession] = useState<BaseSession | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAuthData() {
      setAuthLoading(true);
      try {
        // Replace this with your actual fetch logic
        const response = await fetch("/api/auth/session");

        if (!response.ok) {
          throw new Error("Failed to fetch authentication data");
        }

        const data = await response.json();
        setUser(data.session?.user); // Assumes data contains user and session fields
        setSession(data.session);
        setAuthenticated(true);
      } catch (error: any) {
        setError(error);
        setUser(null);
        setSession(null);
        setAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    }

    fetchAuthData();
  }, []);

  return (
    <authContext.Provider
      value={{
        authenticated,
        user,
        session,
        isLoading: authLoading,
        error,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
