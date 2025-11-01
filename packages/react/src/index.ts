/**
 * This is the React integration of tanstack-themes.
 *
 * TODO: Docs WIP
 *
 * - Render {@link ThemeProvider} just inside your app's body tag to allow for
 *   state synchronization and automatic theme detection.
 * - Use {@link useTheme} to access the current state of the theme store.
 * - Use {@link setTheme} to get the meta tags for the theme color.
 * - Use {@link setVariant} to set the variant of the theme.
 * - Use {@link toggleMode} to toggle the theme mode.
 * - Use {@link getThemeColorMetaTags} to get the meta tags for the theme color.
 *
 * @module
 */
import * as React from "react";
import { useStore } from "@tanstack/react-store";
import { ScriptOnce, type AnyRouteMatch } from "@tanstack/react-router";
import * as core from "@tanstack-themes/core";

export type {
  Register,
  ThemeColorMap,
  TanstackThemesConfig,
} from "@tanstack-themes/core";

/**
 * Set the theme mode.
 * @param themeMode - The theme mode to set.
 */
export function setTheme(themeMode: core.ThemeMode): void {
  core.setTheme(themeMode);
}

/**
 * Set the variant.
 * @param variant - The variant to set.
 */
export function setVariant(variant: core.ThemeVariant): void {
  core.setVariant(variant);
}

/**
 * Toggle the theme mode to the next theme mode between light, dark and auto.
 */
export function toggleMode(): void {
  core.toggleMode();
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
): AnyRouteMatch["meta"] {
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
 *   return <div>{theme.themeMode}</div>;
 * }
 * ```
 *
 * @example MyComponent will only re-render when the theme mode changes.
 * ```tsx
 * function MyComponent() {
 *   const themeMode = useTheme((state) => state.themeMode);
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
export function ThemeProvider(
  props: React.PropsWithChildren<Partial<core.TanstackThemesConfig>>,
): React.ReactNode {
  const mode = useTheme((state) => state.themeMode);

  React.useEffect(() => {
    core.hydrateStore();
  }, []);

  React.useEffect(() => {
    core.setConfig(props);
  }, [props]);

  React.useEffect(() => {
    if (mode !== "auto") return;
    return core.setupPreferredListener();
  }, [mode]);

  return ScriptOnce({
    children: core.getThemeDetectorScript(props.themeColorLookup),
  });
}
