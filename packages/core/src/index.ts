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
  ThemeColorMap,
  TanstackThemesConfig,
  ResolvedMode,
  ThemeAccent,
  ThemeBase,
} from "./config.ts";

import {
  updateDOM,
  getStoredThemeMode,
  getSystemTheme,
  getStoredThemeBase,
  getNextThemeMode,
  setStoredThemeMode,
  setStoredThemeBase,
  setStoredThemeAccent,
  getStoredThemeAccent,
} from "./utils.ts";

export { getThemeDetectorScript } from "./script.ts";
export { THEME_MODES, getConfigValue, setConfig } from "./config.ts";
export type {
  Register,
  ThemeMode,
  ResolvedMode,
  ThemeBase,
  ThemeAccent,
  ThemeColorMap,
  TanstackThemesConfig,
} from "./config.ts";

export interface ThemeStore {
  mode: ThemeMode;
  resolvedMode: ResolvedMode;
  base: ThemeBase;
  accent: ThemeAccent;
}

export const store = new Store<ThemeStore>({
  mode: "auto",
  resolvedMode: "light",
  base: "default",
  accent: "default",
});

export const setThemeMode = (mode: ThemeMode): void => {
  const resolvedMode = mode === "auto" ? getSystemTheme() : mode;
  store.setState((state) => ({
    ...state,
    mode,
    resolvedMode,
  }));
  setStoredThemeMode(mode);
  updateDOM(mode, store.state.base, store.state.accent);
};

export const setThemeBase = (base: ThemeBase): void => {
  store.setState((state) => ({
    ...state,
    base,
  }));
  setStoredThemeBase(base);
  updateDOM(store.state.mode, store.state.base, store.state.accent);
};

export const setThemeAccent = (accent: ThemeAccent): void => {
  store.setState((state) => ({
    ...state,
    accent,
  }));
  setStoredThemeAccent(accent);
  updateDOM(store.state.mode, store.state.base, store.state.accent);
};

export const toggleThemeMode = (): void => {
  setThemeMode(getNextThemeMode(store.state.mode));
};

export const hydrateStore = createClientOnlyFn(() => {
  const mode = getStoredThemeMode();
  const resolvedMode = mode === "auto" ? getSystemTheme() : mode;
  const base = getStoredThemeBase();
  const accent = getStoredThemeAccent();
  store.setState({
    mode,
    resolvedMode,
    base,
    accent,
  });
});

export const setupPreferredListener = createClientOnlyFn(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    const mode = getStoredThemeMode();
    const resolvedMode = mode === "auto" ? getSystemTheme() : mode;
    updateDOM(mode, store.state.base, store.state.accent);
    store.setState((state) => ({
      ...state,
      mode,
      resolvedMode,
    }));
  };
  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
});

export const getThemeColorMetaTags = createIsomorphicFn()
  .client((_: ThemeColorMap) => [])
  .server((themeColorMap: ThemeColorMap) => {
    const base = getStoredThemeBase();
    return [
      {
        name: "theme-color",
        media: "(prefers-color-scheme: light)",
        content: themeColorMap[`${base}-light`],
      },
      {
        name: "theme-color",
        media: "(prefers-color-scheme: dark)",
        content: themeColorMap[`${base}-dark`],
      },
    ];
  });
