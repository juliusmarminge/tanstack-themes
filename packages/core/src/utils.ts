/// <reference types="./ts-reset.d.ts" />
import { createClientOnlyFn, createIsomorphicFn } from "@tanstack/start-client-core";
import { getConfigValue, THEME_MODES } from './config.ts';
import type { ThemeMode, ResolvedMode, ThemeBase, ThemeAccent } from './config.ts';

export const resolveThemeMode = (themeMode: ThemeMode): ResolvedMode => {
  return themeMode === "auto" ? getSystemTheme() : themeMode;
};

export const getStoredThemeMode = createIsomorphicFn()
  .server((): ThemeMode => getConfigValue("defaultMode"))
  .client((): ThemeMode => {
    try {
      const keyPrefix = getConfigValue("localStorageKeyPrefix");
      const storedTheme = localStorage.getItem(`${keyPrefix}mode`);
      return storedTheme && THEME_MODES.includes(storedTheme)
        ? storedTheme
        : getConfigValue("defaultMode");
    } catch {
      return getConfigValue("defaultMode");
    }
  });

export const setStoredThemeMode = createClientOnlyFn((themeMode: ThemeMode) => {
  try {
    const parsedTheme = THEME_MODES.includes(themeMode) ? themeMode : getConfigValue("defaultMode");
    const keyPrefix = getConfigValue("localStorageKeyPrefix");
    localStorage.setItem(`${keyPrefix}mode`, parsedTheme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
});

export const getStoredThemeBase = createIsomorphicFn()
  .server(() => getConfigValue("defaultBase"))
  .client(() => {
    try {
      const keyPrefix = getConfigValue("localStorageKeyPrefix");
      const storedBase = localStorage.getItem(`${keyPrefix}base`);
      return storedBase ?? getConfigValue("defaultBase");
    } catch {
      return getConfigValue("defaultBase");
    }
  });

export const setStoredThemeBase = createClientOnlyFn((base: ThemeBase) => {
  try {
    const keyPrefix = getConfigValue("localStorageKeyPrefix");
    localStorage.setItem(`${keyPrefix}base`, base);
  } catch {
    // Silently fail if localStorage is unavailable
  }
});

export const getStoredThemeAccent = createIsomorphicFn()
  .server(() => getConfigValue("defaultAccent"))
  .client(() => {
    try {
      const keyPrefix = getConfigValue("localStorageKeyPrefix");
      const storedAccent = localStorage.getItem(`${keyPrefix}accent`);
      return storedAccent ?? getConfigValue("defaultAccent");
    } catch {
      return getConfigValue("defaultAccent");
    }
  });

export const setStoredThemeAccent = createClientOnlyFn((accent: ThemeAccent) => {
  try {
    const keyPrefix = getConfigValue("localStorageKeyPrefix");
    localStorage.setItem(`${keyPrefix}accent`, accent);
  } catch {
    // Silently fail if localStorage is unavailable
  }
});

export const getSystemTheme = createIsomorphicFn()
  .server((): ResolvedMode => "light")
  .client((): ResolvedMode => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    return mql.matches ? "dark" : "light";
  });

export const disableAnimation = createClientOnlyFn((nonce?: string) => {
  const css = document.createElement("style");
  if (nonce) css.setAttribute("nonce", nonce);
  css.appendChild(
    document.createTextNode(
      `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
    ),
  );
  document.head.appendChild(css);

  return function cleanup() {
    // Force restyle
    window.getComputedStyle(document.body);

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
});

export const updateDOM = createClientOnlyFn(
  (themeMode: ThemeMode, base: ThemeBase, accent: ThemeAccent) => {
    const themeColorLookup = getConfigValue("themeColorLookup");

    const cleanup = getConfigValue("disableAnimation") ? disableAnimation() : undefined;
    const newTheme = resolveThemeMode(themeMode);

    // 1. Update the root element classList (theme-mode)
    const root = document.documentElement;
    root.classList.remove(...THEME_MODES);
    root.classList.add(newTheme);
    if (themeMode === "auto") root.classList.add("auto");

    // 2. Update the body element classList (theme-base & theme-accent)
    const bodyClss = Array.from(document.body.classList.values());
    const classesToRemove = bodyClss.filter((cls) => cls.startsWith("theme-"));
    document.body.classList.remove(...classesToRemove);
    document.body.classList.add(`theme-${base}`);
    document.body.classList.add(`theme-${accent}`);

    // 3. Update the root element style.colorScheme
    document.documentElement.style.colorScheme = newTheme;

    // 4. Update the theme color meta tags
    if (themeColorLookup) {
      const themeColorMetaTags = document.head.querySelectorAll<HTMLMetaElement>(
        "meta[name='theme-color']",
      );
      themeColorMetaTags.forEach((tag, idx) => {
        if (themeMode === "auto") {
          if (tag.media === "(prefers-color-scheme: light)") {
            tag.content = themeColorLookup[`${base}-light`];
          } else if (tag.media === "(prefers-color-scheme: dark)") {
            tag.content = themeColorLookup[`${base}-dark`];
          } else if (tag.media === "") {
            const isLightTag = idx === 0;
            tag.content = themeColorLookup[`${base}-${isLightTag ? "light" : "dark"}`];
            tag.media = `(prefers-color-scheme: ${isLightTag ? "light" : "dark"})`;
          }
        } else {
          tag.content = themeColorLookup[`${base}-${newTheme}`];
          tag.media = "";
        }
      });
    }

    cleanup?.();
  },
);

export const getNextThemeMode = createClientOnlyFn((current: ThemeMode): ThemeMode => {
  const themes: ThemeMode[] =
    getSystemTheme() === "dark" ? ["auto", "light", "dark"] : ["auto", "dark", "light"];
  return themes[(themes.indexOf(current) + 1) % themes.length];
});
