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
  localStorageKeyPrefix: string;
}

const configStore = new Store<TanstackThemesConfig>({
  themeColorLookup: undefined,
  disableAnimation: true,
  localStorageKeyPrefix: "",
});

export const setConfig = (config: Partial<TanstackThemesConfig>) => {
  configStore.setState((state) => ({
    ...state,
    ...config,
  }));
};

export const getConfigValue = <
  T extends keyof TanstackThemesConfig | undefined = undefined,
>(
  key?: T,
): T extends undefined
  ? TanstackThemesConfig
  : T extends keyof TanstackThemesConfig
    ? TanstackThemesConfig[T]
    : never => {
  return (key ? configStore.state[key] : configStore.state) as any;
};
