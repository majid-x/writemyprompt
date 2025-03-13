"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * @typedef {Object} ThemeProviderProps
 * @property {React.ReactNode} children - The content to be wrapped by the theme provider
 * @property {any} [props] - Additional props to pass to the theme provider
 */

/**
 * Theme provider component for handling light/dark mode
 * @param {ThemeProviderProps} props
 */
export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
