/**
 * This is the core package of tanstack-themes.
 * @module
 */
import { createClientOnlyFn } from "@tanstack/start-client-core";
import { Store } from "@tanstack/store";
import type { ThemeMode, ThemeVariant, ResolvedTheme } from "./config.ts";
export * from "./config.ts";
import {
  updateThemeClass,
  getStoredThemeMode,
  getSystemTheme,
  getStoredThemeVariant,
  getNextTheme,
  setStoredThemeMode,
  setStoredThemeVariant,
} from "./utils.ts";
export { getThemeDetectorScript } from "./script.ts";

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
  updateThemeClass(themeMode, store.state.variant);
};

export const setVariant = (variant: ThemeVariant): void => {
  store.setState((state) => ({
    ...state,
    variant,
  }));
  setStoredThemeVariant(variant);
  updateThemeClass(store.state.themeMode, variant);
};

export const toggleMode = (): void => {
  setTheme(getNextTheme(store.state.themeMode));
};

export const hydrateStore = createClientOnlyFn(() => {
  const themeMode = getStoredThemeMode();
  const resolvedTheme = themeMode === "auto" ? getSystemTheme() : themeMode;
  const variant = getStoredThemeVariant();
  store.setState({ resolvedTheme, themeMode, variant });
});

export const setupPreferredListener = createClientOnlyFn(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    const variant = getStoredThemeVariant();
    updateThemeClass("auto", variant);
    store.setState((state) => ({
      ...state,
      resolvedTheme:
        state.themeMode === "auto" ? getSystemTheme() : state.themeMode,
    }));
  };
  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
});
