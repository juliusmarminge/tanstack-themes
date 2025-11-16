/**
 * This is the React integration of tanstack-themes.
 *
 * TODO: Docs WIP
 *
 * - Render {@link ThemeProvider} just inside your app's body tag to allow for
 *   state synchronization and automatic theme detection.
 * - Use {@link useTheme} to access the current state of the theme store.
 * - Use {@link setThemeMode} to get the meta tags for the theme color.
 * - Use {@link setThemeBase} to set the base color of the theme.
 * - Use {@link setThemeAccent} to set the accent color of the theme.
 * - Use {@link toggleThemeMode} to toggle the theme mode.
 * - Use {@link getThemeColorMetaTags} to get the meta tags for the theme color.
 *
 * @module
 */
import * as React from "react";
import { useStore } from "@tanstack/react-store";
import { ScriptOnce } from "@tanstack/react-router";
import * as core from "@tanstack-themes/core";

export { THEME_MODES } from "@tanstack-themes/core";
export type {
  Register,
  ThemeColorMap,
  TanstackThemesConfig,
  ThemeMode,
  ResolvedMode,
  ThemeBase,
  ThemeAccent,
} from "@tanstack-themes/core";

/**
 * Set the theme mode.
 * @param themeMode - The theme mode to set.
 */
export function setThemeMode(themeMode: core.ThemeMode): void {
  core.setThemeMode(themeMode);
}

/**
 * Set the variant.
 * @param base - The base color to set.
 */
export function setThemeBase(base: core.ThemeBase): void {
  core.setThemeBase(base);
}

/**
 * Set the variant.
 * @param accent - The accent color to set.
 */
export function setThemeAccent(accent: core.ThemeAccent): void {
  core.setThemeAccent(accent);
}

/**
 * Toggle the theme mode to the next theme mode between light, dark and auto.
 */
export function toggleThemeMode(): void {
  core.toggleThemeMode();
}

/**
 * Get the meta tags for the theme color. Return these from the root loader's `head` function.
 *
 * @param themeColorMap - The theme color map to use.
 * @returns The meta tags for the theme color.
 *
 * @example In your `routes/__root.tsx` file:
 * ```tsx
 * function RootLoader() {
 *   return {
 *     head: () => ({
 *       meta: [
 *         // ... other meta tags
 *         ...getThemeColorMetaTags(THEME_COLOR_MAP),
 *       ],
 *     }),
 *   };
 * }
 * ```
 */
export function getThemeColorMetaTags(
  themeColorMap: core.ThemeColorMap,
): Array<React.JSX.IntrinsicElements["meta"]> {
  return core.getThemeColorMetaTags(themeColorMap);
}

/**
 * Hook to access the current state of the theme store.
 * Accepts an optional selector function to extract a specific part of the state.
 * Providing a selector allows for granular React re-rendering.
 *
 * @param selector - Optional selector function to extract a specific part of the state.
 * @returns The selected part of the theme state, or the entire theme state if no selector is provided.
 *
 * @example MyComponent will re-render when any part of the theme state changes.
 * ```tsx
 * function MyComponent() {
 *   const theme = useTheme();
 *   return <div>{theme.mode}</div>;
 * }
 * ```
 *
 * @example MyComponent will only re-render when the theme mode changes.
 * ```tsx
 * function MyComponent() {
 *   const themeMode = useTheme((state) => state.mode);
 *   return <div>{themeMode}</div>;
 * }
 * ```
 */
export function useTheme<T = core.ThemeStore>(
  selector?: (state: core.ThemeStore) => T,
): T {
  return useStore(core.store, selector);
}

/**
 * Render this just inside your app's body tag to allow for
 * state synchronization and automatic theme detection.
 *
 * @param props - The props to pass to the provider.
 * @returns The provider component.
 *
 * @example In your `routes/__root.tsx` file:
 * ```tsx
 * function RootDocument({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <head>
 *         <HeadContent />
 *       </head>
 *       <body suppressHydrationWarning>
 *         <ThemeProvider />
 *         {children}
 *         <Scripts />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  defaultBase,
  defaultAccent,
  ...config
}: React.PropsWithChildren<
  Partial<core.TanstackThemesConfig> & {
    defaultBase?: core.ThemeBase;
    defaultAccent?: core.ThemeAccent;
  }
>): React.ReactNode {
  const mode = useTheme((state) => state.mode);

  React.useEffect(() => {
    core.hydrateStore(defaultBase, defaultAccent);
  }, []);

  React.useEffect(() => {
    core.setConfig(config);
  }, [config]);

  React.useEffect(() => {
    if (mode !== "auto") return;
    return core.setupPreferredListener();
  }, [mode]);

  return ScriptOnce({
    children: core.getThemeDetectorScript(config.themeColorLookup),
  });
}

/**
 * Hook to get the attributes for the html element.
 * @returns The attributes for the html element.
 */
export function useHtmlAttributes(): React.JSX.IntrinsicElements["html"] {
  // @ts-expect-error - this is a private property
  const isHydrated: boolean = useTheme((state) => state.__isHydrated);
  const mode = useTheme((state) => state.mode);
  const scheme = useTheme((state) => state.resolvedMode);
  return React.useMemo(() => {
    if (!isHydrated) {
      return {
        suppressHydrationWarning: true,
      };
    }
    return {
      className: mode === "auto" ? `${scheme} auto` : mode,
      style: {
        colorScheme: scheme,
      },
    };
  }, [mode, scheme]);
}

/**
 * Hook to get the attributes for the body element.
 * @returns The attributes for the body element.
 */
export function useBodyAttributes(): React.JSX.IntrinsicElements["body"] {
  // @ts-expect-error - this is a private property
  const isHydrated: boolean = useTheme((state) => state.__isHydrated);
  const base = useTheme((state) => state.base);
  const accent = useTheme((state) => state.accent);
  return React.useMemo(() => {
    if (!isHydrated) {
      return {
        suppressHydrationWarning: true,
      };
    }
    return {
      className: `theme-${base} theme-${accent}`,
    };
  }, [isHydrated, base, accent]);
}
