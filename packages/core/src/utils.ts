import {
  createClientOnlyFn,
  createIsomorphicFn,
} from "@tanstack/start-client-core";
import {
  ThemeMode,
  THEME_MODES,
  ResolvedTheme,
  configStore,
} from "./config.ts";

export const getStoredThemeMode = createIsomorphicFn()
  .server((): ThemeMode => "auto")
  .client((): ThemeMode => {
    try {
      const storedTheme = localStorage.getItem("theme-mode");
      if (!storedTheme) return "auto";
      return THEME_MODES.includes(storedTheme) ? storedTheme : "auto";
    } catch {
      return "auto";
    }
  });

export const setStoredThemeMode = createClientOnlyFn((theme: ThemeMode) => {
  try {
    const parsedTheme = THEME_MODES.includes(theme) ? theme : "auto";
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

export const updateDOM = createClientOnlyFn(
  (themeMode: ThemeMode, variant: string) => {
    const shouldDisableAnimation = configStore.state.disableAnimation;
    const themeColorLookup = configStore.state.themeColorLookup;

    const cleanup = shouldDisableAnimation ? disableAnimation() : undefined;
    const newTheme = themeMode === "auto" ? getSystemTheme() : themeMode;

    // 1. Update the root element classList (theme-mode)
    const root = document.documentElement;
    root.classList.remove(...THEME_MODES);
    root.classList.add(newTheme);
    if (themeMode === "auto") root.classList.add("auto");

    // 2. Update the body element classList (theme-variant)
    const bodyClss = Array.from(document.body.classList.values());
    const variantClasses = bodyClss.filter((cls) => cls.startsWith("theme-"));
    document.body.classList.remove(...variantClasses);
    document.body.classList.add(`theme-${variant}`);

    // 3. Update the root element style.colorScheme
    document.documentElement.style.colorScheme = newTheme;

    // 4. Update the theme color meta tags
    if (themeColorLookup) {
      const themeColorMetaTags =
        document.head.querySelectorAll<HTMLMetaElement>(
          "meta[name='theme-color']",
        );
      themeColorMetaTags.forEach((tag, idx) => {
        if (themeMode === "auto") {
          if (tag.media === "(prefers-color-scheme: light)") {
            tag.content = themeColorLookup[`${variant}-light`];
          } else if (tag.media === "(prefers-color-scheme: dark)") {
            tag.content = themeColorLookup[`${variant}-dark`];
          } else if (tag.media === "") {
            const isLightTag = idx === 0;
            tag.content =
              themeColorLookup[`${variant}-${isLightTag ? "light" : "dark"}`];
            tag.media = `(prefers-color-scheme: ${isLightTag ? "light" : "dark"})`;
          }
        } else {
          tag.content = themeColorLookup[`${variant}-${newTheme}`];
          tag.media = "";
        }
      });
    }

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
