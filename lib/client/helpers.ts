/** @format */

import { NextRequest } from "next/server";

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
 * // Example usage:
 * SignOut({ redirect: "/home" });
 */
export function SignOut(options?: IOptionType): void {
  // Function to handle user sign-out with optional redirect options
  const { redirect } = options || {};

  // Make a request to the backend to log out the user
  fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then(() => {
      // Redirect to the specified URL or default to home
      const redirectUrl = redirect || "/";
      window.location.href = redirectUrl;
    })
    .catch((error) => {
      console.error("Error during sign-out:", error);
      // Optionally handle sign-out errors, e.g., show an error message
    });
}


