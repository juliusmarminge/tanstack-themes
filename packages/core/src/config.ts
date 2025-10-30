export const VALID_THEME_MODES = ["light", "dark", "auto"] as const;
export type ThemeMode = (typeof VALID_THEME_MODES)[number];
export type ResolvedTheme = Exclude<ThemeMode, "auto">;

export interface Register {}
