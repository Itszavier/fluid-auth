/** @format */

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
 */
export function SignUp(provider: string, options?: ISignUpOption): void {
  // Implementation logic for user sign-up
  // For example, you might trigger the sign-up process with the specified provider
  // and handle the redirect or other options.
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
  // Implementation logic for user sign-out
  // For example, you might end the user session and handle the redirect or other options.
}
