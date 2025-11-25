import { THEME_MODES, TanstackThemesConfig } from "./config.ts";

export const getThemeDetectorScript = function (config: TanstackThemesConfig) {
  const fnArgs = [
    THEME_MODES,
    config.themeColorLookup,
    config.localStorageKeyPrefix,
    config.defaultMode,
    config.defaultBase,
    config.defaultAccent,
  ] as const;

  function themeFn([themeModes, colors, keyPrefix, dMode, dBase, dAccent]: typeof fnArgs) {
    const d = document.documentElement;
    const b = document.body;
    const ls = localStorage;

    const storedMode = ls.getItem(`${keyPrefix}mode`) ?? dMode;
    const validMode = themeModes.includes(storedMode) ? storedMode : dMode;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const resolvedTheme = mql.matches ? "dark" : "light";

    if (validMode === "auto") {
      d.classList.add(resolvedTheme, "auto");
      d.style.colorScheme = resolvedTheme;
    } else {
      d.classList.add(validMode);
      d.style.colorScheme = validMode;
    }

    const storedBase = ls.getItem(`${keyPrefix}base`) ?? dBase;
    b.classList.add(`theme-${storedBase}`);

    const storedAccent = ls.getItem(`${keyPrefix}accent`) ?? dAccent;
    b.classList.add(`theme-${storedAccent}`);

    if (colors) {
      const themeColorMetaTags = document.head.querySelectorAll<HTMLMetaElement>(
        "meta[name='theme-color']",
      );
      for (const tag of themeColorMetaTags) {
        if (validMode === "auto") {
          if (tag.media === "(prefers-color-scheme: light)") {
            tag.content = colors[`${storedBase}-light`];
          } else if (tag.media === "(prefers-color-scheme: dark)") {
            tag.content = colors[`${storedBase}-dark`];
          }
        } else {
          tag.content = colors[`${storedBase}-${validMode}`];
          tag.media = "";
        }
      }
    }
  }
  return `(${themeFn.toString()})(${JSON.stringify(fnArgs)});`;
};
