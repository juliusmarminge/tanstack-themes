import { THEME_MODES, ThemeColorMap } from "./config.ts";

export const getThemeDetectorScript = function (
  themeColorLookup: ThemeColorMap | undefined,
) {
  const fnArgs = [THEME_MODES, themeColorLookup] as const;

  function themeFn([validThemeModes, themeColorLookup]: typeof fnArgs) {
    const storedTheme = localStorage.getItem("theme-mode") ?? "auto";
    const validTheme = validThemeModes.includes(storedTheme)
      ? storedTheme
      : "auto";
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const resolvedTheme = mql.matches ? "dark" : "light";

    if (validTheme === "auto") {
      document.documentElement.classList.add(resolvedTheme, "auto");
      document.documentElement.style.colorScheme = resolvedTheme;
    } else {
      document.documentElement.classList.add(validTheme);
      document.documentElement.style.colorScheme = validTheme;
    }

    const storedBase = localStorage.getItem("theme-base") ?? "default";
    document.body.classList.add(`theme-${storedBase}`);

    const storedAccent = localStorage.getItem("theme-accent") ?? "default";
    document.body.classList.add(`theme-${storedAccent}`);

    if (themeColorLookup) {
      const themeColorMetaTags =
        document.head.querySelectorAll<HTMLMetaElement>(
          "meta[name='theme-color']",
        );
      for (const tag of themeColorMetaTags) {
        if (validTheme === "auto") {
          if (tag.media === "(prefers-color-scheme: light)") {
            tag.content = themeColorLookup[`${storedBase}-light`];
          } else if (tag.media === "(prefers-color-scheme: dark)") {
            tag.content = themeColorLookup[`${storedBase}-dark`];
          }
        } else {
          tag.content = themeColorLookup[`${storedBase}-${validTheme}`];
          tag.media = "";
        }
      }
    }
  }
  return `(${themeFn.toString()})(${JSON.stringify(fnArgs)});`;
};
