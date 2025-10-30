import {
  createClientOnlyFn,
  createIsomorphicFn,
} from "@tanstack/start-client-core";
import { ThemeMode, VALID_THEME_MODES, ResolvedTheme } from "./config.ts";

export const getStoredThemeMode = createIsomorphicFn()
  .server((): ThemeMode => "auto")
  .client((): ThemeMode => {
    try {
      const storedTheme = localStorage.getItem("theme-mode");
      return VALID_THEME_MODES.includes(storedTheme as ThemeMode)
        ? (storedTheme as ThemeMode)
        : "auto";
    } catch {
      return "auto";
    }
  });

export const setStoredThemeMode = createClientOnlyFn((theme: ThemeMode) => {
  try {
    const parsedTheme = VALID_THEME_MODES.includes(theme) ? theme : "auto";
    localStorage.setItem("theme-mode", parsedTheme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
});

export const getStoredThemeVariant = createIsomorphicFn()
  .server((defaultVariant: string = "default") => defaultVariant)
  .client((defaultVariant = "default") => {
    try {
      const storedVariant = localStorage.getItem("theme-variant");
      return storedVariant ?? defaultVariant;
    } catch {
      return defaultVariant;
    }
  });

export const setStoredThemeVariant = createClientOnlyFn((variant: string) => {
  try {
    localStorage.setItem("theme-variant", variant);
  } catch {
    // Silently fail if localStorage is unavailable
  }
});

export const getSystemTheme = createIsomorphicFn()
  .server((): ResolvedTheme => "light")
  .client((): ResolvedTheme => {
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

export const updateThemeClass = createClientOnlyFn(
  (
    themeMode: ThemeMode,
    variant: string,
    shouldDisableAnimation: boolean = true,
  ) => {
    const cleanup = shouldDisableAnimation ? disableAnimation() : undefined;

    const root = document.documentElement;
    root.classList.remove(...VALID_THEME_MODES);
    const newTheme = themeMode === "auto" ? getSystemTheme() : themeMode;
    root.classList.add(newTheme);

    if (themeMode === "auto") {
      root.classList.add("auto");
    }

    if (variant) {
      const bodyClss = Array.from(document.body.classList.values());
      const variantClasses = bodyClss.filter((cls) => cls.startsWith("theme-"));
      document.body.classList.remove(...variantClasses);
      document.body.classList.add(`theme-${variant}`);
    }

    document.documentElement.style.colorScheme = newTheme;

    cleanup?.();
  },
);

export const getNextThemeMode = createClientOnlyFn(
  (current: ThemeMode): ThemeMode => {
    const themes: ThemeMode[] =
      getSystemTheme() === "dark"
        ? ["auto", "light", "dark"]
        : ["auto", "dark", "light"];
    return themes[(themes.indexOf(current) + 1) % themes.length];
  },
);
