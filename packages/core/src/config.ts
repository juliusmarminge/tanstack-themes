export interface Register {}

export const VALID_THEME_MODES = ["light", "dark", "auto"] as const;
export type ThemeMode = (typeof VALID_THEME_MODES)[number];
export type ResolvedTheme = Exclude<ThemeMode, "auto">;

export type ThemeVariant = Register extends { variant: string }
  ? Register["variant"]
  : string;

export type ThemeColorMap = Record<`${ThemeVariant}-${ResolvedTheme}`, string>;
