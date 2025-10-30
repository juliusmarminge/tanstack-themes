/**
 * This is the core package of tanstack-themes.
 * @module
 */
import {
  createClientOnlyFn,
  createIsomorphicFn,
} from "@tanstack/start-client-core";
import { Store } from "@tanstack/store";
import type {
  ThemeMode,
  Register,
  ResolvedTheme,
  ThemeVariant,
  ThemeColorMap,
  TanstackThemesConfig,
} from "./config.ts";
import { configStore } from "./config.ts";
import {
  updateDOM,
  getStoredThemeMode,
  getSystemTheme,
  getStoredThemeVariant,
  getNextThemeMode,
  setStoredThemeMode,
  setStoredThemeVariant,
} from "./utils.ts";
export { getThemeDetectorScript } from "./script.ts";
export type {
  Register,
  ThemeColorMap,
  TanstackThemesConfig,
} from "./config.ts";

export interface ThemeStore {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  variant: ThemeVariant;
}

export const store = new Store<ThemeStore>({
  themeMode: "auto",
  resolvedTheme: "light",
  variant: "default",
});

export const setTheme = (themeMode: ThemeMode): void => {
  store.setState((state) => ({
    ...state,
    themeMode,
  }));
  setStoredThemeMode(themeMode);
  updateDOM(themeMode, store.state.variant);
};

export const setVariant = (variant: ThemeVariant): void => {
  store.setState((state) => ({
    ...state,
    variant,
  }));
  setStoredThemeVariant(variant);
  updateDOM(store.state.themeMode, variant);
};

export const toggleMode = (): void => {
  setTheme(getNextThemeMode(store.state.themeMode));
};

export const hydrateStore = createClientOnlyFn(() => {
  const themeMode = getStoredThemeMode();
  const resolvedTheme = themeMode === "auto" ? getSystemTheme() : themeMode;
  const variant = getStoredThemeVariant();
  store.setState((state) => ({
    ...state,
    resolvedTheme,
    themeMode,
    variant,
  }));
});

export const setConfig = (config: Partial<TanstackThemesConfig>) => {
  configStore.setState((state) => ({
    ...state,
    ...config,
  }));
};

export const setupPreferredListener = createClientOnlyFn(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    const variant = getStoredThemeVariant();
    updateDOM("auto", variant);
    store.setState((state) => ({
      ...state,
      resolvedTheme:
        state.themeMode === "auto" ? getSystemTheme() : state.themeMode,
    }));
  };
  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
});

export const getThemeColorMetaTags = createIsomorphicFn()
  .client((_: ThemeColorMap) => [])
  .server((themeColorMap: ThemeColorMap) => {
    const variant = getStoredThemeVariant();
    return [
      {
        name: "theme-color",
        media: "(prefers-color-scheme: light)",
        content: themeColorMap[`${variant}-light`],
      },
      {
        name: "theme-color",
        media: "(prefers-color-scheme: dark)",
        content: themeColorMap[`${variant}-dark`],
      },
    ];
  });
