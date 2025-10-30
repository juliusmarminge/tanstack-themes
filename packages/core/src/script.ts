import { VALID_THEME_MODES, type ThemeMode } from "./config.ts";

export const getThemeDetectorScript = function (
  themeKey: string,
  variantKey: string,
  validVariants: string[],
  themeColorLookup: Record<string, string>,
) {
  // We can't reference the runtime values `ThemeModeSchema` or `ThemeVariantSchema`
  // inside of themeFn because this code is inlined in head without access to outside values.
  // So we pass the arguments as a JSON string to the function.
  const fnArgs = [
    themeKey,
    variantKey,
    VALID_THEME_MODES,
    validVariants,
    themeColorLookup,
  ] as const;

  function themeFn([
    themeKey,
    variantKey,
    validThemes,
    validVariants,
    themeColorLookup,
  ]: typeof fnArgs) {
    const sanitizeTheme = (theme: string): string => {
      return validThemes.includes(theme as ThemeMode) ? theme : "auto";
    };
    const sanitizeVariant = (variant: string) => {
      return validVariants.includes(variant) ? variant : "default";
    };

    const storedTheme = localStorage.getItem(themeKey) ?? "auto";
    const validTheme = sanitizeTheme(storedTheme);

    console.log("[script] stored/valid theme", storedTheme, validTheme);

    if (validTheme === "auto") {
      const autoTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      document.documentElement.classList.add(autoTheme, "auto");
    } else {
      document.documentElement.classList.add(validTheme);
    }

    const storedVariant = localStorage.getItem(variantKey) ?? "default";
    const validVariant = sanitizeVariant(storedVariant);
    document.body.classList.add(`theme-${validVariant}`);

    console.log("[script] storde/valid variant", storedVariant, validVariant);

    const themeColorMetaTags = document.head.querySelectorAll<HTMLMetaElement>(
      "meta[name='theme-color']",
    );
    for (const tag of themeColorMetaTags) {
      if (validTheme === "auto") {
        tag.content = themeColorLookup[`${validVariant}-light`];
        tag.content = themeColorLookup[`${validVariant}-dark`];
      } else {
        tag.content = themeColorLookup[`${validVariant}-${validTheme}`];
      }
    }

    console.log("[script] themeColorMetaTags", themeColorMetaTags);
  }
  return `(${themeFn.toString()})(${JSON.stringify(fnArgs)});`;
};
