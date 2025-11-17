import { Store } from "@tanstack/store";

export interface Register {}

export const THEME_MODES = ["light", "dark", "auto"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
export type ResolvedMode = Exclude<ThemeMode, "auto">;

export type ThemeBase = Register extends { base: string }
  ? Register["base"]
  : string;

export type ThemeAccent = Register extends { accent: string }
  ? Register["accent"]
  : string;

export type ThemeColorMap = Record<`${ThemeBase}-${ResolvedMode}`, string>;

export interface TanstackThemesConfig {
  themeColorLookup: ThemeColorMap | undefined;
  disableAnimation: boolean;
}

export const configStore = new Store<TanstackThemesConfig>({
  themeColorLookup: undefined,
  disableAnimation: true,
});
