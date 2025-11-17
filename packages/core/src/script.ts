import { THEME_MODES, TanstackThemesConfig } from "./config.ts";

export const getThemeDetectorScript = function (config: TanstackThemesConfig) {
  const fnArgs = [
    THEME_MODES,
    config.themeColorLookup,
    config.localStorageKeyPrefix,
  ] as const;

  function themeFn([themeModes, colors, keyPrefix]: typeof fnArgs) {
    const d = document.documentElement;
    const b = document.body;
    const ls = localStorage;

    const storedTheme = ls.getItem(`${keyPrefix}theme-mode`) ?? "auto";
    const validTheme = themeModes.includes(storedTheme) ? storedTheme : "auto";
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const resolvedTheme = mql.matches ? "dark" : "light";

    if (validTheme === "auto") {
      d.classList.add(resolvedTheme, "auto");
      d.style.colorScheme = resolvedTheme;
    } else {
      d.classList.add(validTheme);
      d.style.colorScheme = validTheme;
    }

    const storedBase = ls.getItem(`${keyPrefix}theme-base`) ?? "default";
    b.classList.add(`theme-${storedBase}`);

    const storedAccent = ls.getItem(`${keyPrefix}theme-accent`) ?? "default";
    b.classList.add(`theme-${storedAccent}`);

    if (colors) {
      const themeColorMetaTags =
        document.head.querySelectorAll<HTMLMetaElement>(
          "meta[name='theme-color']",
        );
      for (const tag of themeColorMetaTags) {
        if (validTheme === "auto") {
          if (tag.media === "(prefers-color-scheme: light)") {
            tag.content = colors[`${storedBase}-light`];
          } else if (tag.media === "(prefers-color-scheme: dark)") {
            tag.content = colors[`${storedBase}-dark`];
          }
        } else {
          tag.content = colors[`${storedBase}-${validTheme}`];
          tag.media = "";
        }
      }
    }
  }
  return `(${themeFn.toString()})(${JSON.stringify(fnArgs)});`;
};
