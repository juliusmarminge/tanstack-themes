/**
 * TODO: All this should be configurable by the user
 */

export const THEME_MODE_KEY = "theme-mode";
export const THEME_VARIANT_KEY = "theme-variant";

export const VALID_THEME_MODES = ["light", "dark", "auto"] as const;
export type ThemeMode = (typeof VALID_THEME_MODES)[number];
export type ResolvedTheme = Exclude<ThemeMode, "auto">;

export const VALID_THEME_VARIANTS = ["default", "t3chat", "catpuccin"]; // TODO: This should come from the user
export type ThemeVariant = string; // TODO: Can we type this?
