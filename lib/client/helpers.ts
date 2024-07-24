/** @format */

import { BaseSessionData } from "../core/base";

// Basic options interface for handling redirects
export interface IOptionType {
  /**
   * URL to redirect the user after the operation (sign-in or sign-out).
   * Defaults to the root URL if not specified.
   */
  redirect?: string;
}

// Extended options for sign-up which can include additional custom properties
export interface ISignUpOption extends IOptionType {
  /**
   * Allows additional custom properties for sign-up options.
   * This can include provider-specific options or other relevant settings.
   */
  [key: string]: any;
}

/**
 * Function to handle user sign-up with a specified provider and options.
 *
 * @param provider - The name of the provider to use for sign-up (e.g., "google", "github").
 * @param options - Optional additional options for sign-up. Includes `redirect` for post-sign-up redirection and other custom properties.
 *
 * @example
 * // Example usage:
 * SignUp("google", { redirect: "/dashboard", customParam: "value" });
 *
 */
export function SignIn(provider: string, options?: ISignUpOption): void {
  const baseUrl = window.location.origin;
  const redirectUrl = options?.redirect || "/";
  console.log("baseurl", baseUrl);
  // Redirect the user to the sign-up URL
  window.location.href = `${baseUrl}/api/auth/signin?provider=${provider}&redirecturl=${encodeURIComponent(
    redirectUrl
  )}`;
}

/**
 * Function to handle user sign-out with optional redirect options.
 *
 * @param options - Optional options for sign-out. Includes `redirect` for post-sign-out redirection.
 *
 * @example
 *
 *
 */
export async function SignOut(
  options?: IOptionType
): Promise<{ message: string }> {
  // Function to handle user sign-out with optional redirect options
  const { redirect } = options || {};

  // Make a request to the backend to log out the user
  const response = await fetch("/api/auth/logout");

  if (!response.ok) {
    throw new Error(`SignOut Failed: ${response.statusText} `);
  }
  return await response.json();
}

interface IData {
  email: string;
  password: string;
  redirectUrl?: string;
}

export async function SignInWithCredentials(provider: string, data: IData) {
  const response = await fetch(`/api/auth/signin?provider=${provider}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // Handle errors here
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to sign in");
  }

  const result = await response.json();
  return result;
}

export async function getSession(): Promise<BaseSessionData> {
  try {
    const url = `/api/auth/session`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch session: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error; // Re-throw error after logging
  }
}
