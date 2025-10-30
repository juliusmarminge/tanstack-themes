import {
  createClientOnlyFn,
  createIsomorphicFn,
} from "@tanstack/start-client-core";
import {
  ThemeVariant,
  ThemeMode,
  THEME_MODE_KEY,
  VALID_THEME_MODES,
  THEME_VARIANT_KEY,
  VALID_THEME_VARIANTS,
  ResolvedTheme,
} from "./config.ts";

const toClassName = (variant: ThemeVariant) => `theme-${variant}`;

export const getStoredThemeMode = createIsomorphicFn()
  .server((): ThemeMode => "auto")
  .client((): ThemeMode => {
    try {
      const storedTheme = localStorage.getItem(THEME_MODE_KEY);
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
    localStorage.setItem(THEME_MODE_KEY, parsedTheme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
});

export const getStoredThemeVariant = createIsomorphicFn()
  .server((_?: ThemeVariant): ThemeVariant => "default")
  .client((defaultVariant = "default"): ThemeVariant => {
    try {
      const storedVariant = localStorage.getItem(THEME_VARIANT_KEY);
      return storedVariant ?? defaultVariant;
    } catch {
      return defaultVariant;
    }
  });

export const setStoredThemeVariant = createClientOnlyFn(
  (variant: ThemeVariant) => {
    try {
      localStorage.setItem(THEME_VARIANT_KEY, variant);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  },
);

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
  (themeMode: ThemeMode, variant: ThemeVariant) => {
    const cleanup = disableAnimation();

    const root = document.documentElement;
    root.classList.remove(...VALID_THEME_MODES);
    const newTheme = themeMode === "auto" ? getSystemTheme() : themeMode;
    root.classList.add(newTheme);

    if (themeMode === "auto") {
      root.classList.add("auto");
    }

    if (variant) {
      document.body.classList.remove(...VALID_THEME_VARIANTS.map(toClassName));
      document.body.classList.add(toClassName(variant));
    }

    cleanup();
  },
);

export const getNextTheme = createClientOnlyFn(
  (current: ThemeMode): ThemeMode => {
    const themes: ThemeMode[] =
      getSystemTheme() === "dark"
        ? ["auto", "light", "dark"]
        : ["auto", "dark", "light"];
    return themes[(themes.indexOf(current) + 1) % themes.length];
  },
);
