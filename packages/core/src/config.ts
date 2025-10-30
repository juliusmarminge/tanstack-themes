import { Store } from "@tanstack/store";

export interface Register {}

export const VALID_THEME_MODES = ["light", "dark", "auto"] as const;
export type ThemeMode = (typeof VALID_THEME_MODES)[number];
export type ResolvedTheme = Exclude<ThemeMode, "auto">;

export type ThemeVariant = Register extends { variant: string }
  ? Register["variant"]
  : string;

export type ThemeColorMap = Record<`${ThemeVariant}-${ResolvedTheme}`, string>;

export interface TanstackThemesConfig {
  themeColorLookup: ThemeColorMap | undefined;
  disableAnimation: boolean;
}

export const configStore = new Store<TanstackThemesConfig>({
  themeColorLookup: undefined,
  disableAnimation: true,
});
