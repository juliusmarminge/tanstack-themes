import { VALID_THEME_MODES, ThemeMode, ThemeColorMap } from "./config.ts";

export const getThemeDetectorScript = function (
  themeColorLookup?: ThemeColorMap,
) {
  const fnArgs = [VALID_THEME_MODES, themeColorLookup] as const;

  function themeFn([validThemeModes, themeColorLookup]: typeof fnArgs) {
    const storedTheme = localStorage.getItem("theme-mode") ?? "auto";
    const validTheme = validThemeModes.includes(storedTheme as ThemeMode)
      ? (storedTheme as ThemeMode)
      : "auto";

    if (validTheme === "auto") {
      const autoTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.classList.add(autoTheme, "auto");
    } else {
      document.documentElement.classList.add(validTheme);
    }

    const storedVariant = localStorage.getItem("theme-variant") ?? "default";
    document.body.classList.add(`theme-${storedVariant}`);

    if (themeColorLookup) {
      const themeColorMetaTags =
        document.head.querySelectorAll<HTMLMetaElement>(
          "meta[name='theme-color']",
        );
      for (const tag of themeColorMetaTags) {
        if (validTheme === "auto") {
          tag.content = themeColorLookup[`${storedVariant}-light`];
          tag.content = themeColorLookup[`${storedVariant}-dark`];
        } else {
          tag.content = themeColorLookup[`${storedVariant}-${validTheme}`];
        }
      }
    }
  }
  return `(${themeFn.toString()})(${JSON.stringify(fnArgs)});`;
};
