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
  /**
   * The default mode to use when no mode is stored in localStorage.
   * @default "auto"
   */
  defaultMode: ThemeMode;
  /**
   * The default base to use when no base is stored in localStorage.
   * @default "default"
   */
  defaultBase: ThemeBase;
  /**
   * The default accent to use when no accent is stored in localStorage.
   * @default "default"
   */
  defaultAccent: ThemeAccent;
  /**
   * Lookup map for setting `meta[name="theme-color"]` tags.
   * @default undefined
   */
  themeColorLookup: ThemeColorMap | undefined;
  /**
   * Whether to disable animation while changing the theme.
   * @default true
   */
  disableAnimation: boolean;
  /**
   * The prefix for the localStorage keys.
   * @default "theme-"
   */
  localStorageKeyPrefix: string;
}

const configStore = new Store<TanstackThemesConfig>({
  defaultMode: "auto",
  defaultBase: "default",
  defaultAccent: "default",
  themeColorLookup: undefined,
  disableAnimation: true,
  localStorageKeyPrefix: "theme-",
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
