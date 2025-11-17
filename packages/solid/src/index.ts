/**
 * This is the Solid.js integration of tanstack-themes.
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
import * as Solid from "solid-js";
import { useStore } from "@tanstack/solid-store";
import { ScriptOnce, useHydrated } from "@tanstack/solid-router";
import * as core from "@tanstack-themes/core";

export { THEME_MODES } from "@tanstack-themes/core";
export type {
  ThemeMode,
  ResolvedMode,
  ThemeBase,
  ThemeAccent,
  Register,
  ThemeColorMap,
  TanstackThemesConfig,
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
): Array<Solid.JSX.IntrinsicElements["meta"]> {
  return core.getThemeColorMetaTags(themeColorMap);
}

/**
 * Hook to access the current state of the theme store.
 * Accepts an optional selector function to extract a specific part of the state.
 * Providing a selector allows for granular signal subscriptions.
 *
 * @param selector - Optional selector function to extract a specific part of the state.
 * @returns Accessor to the selected part of the theme state, or the entire theme state if no selector is provided.
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
 *   const theme = useTheme((state) => state.themeMode);
 *   return <div>{theme()}</div>;
 * }
 * ```
 */
export function useTheme<T = core.ThemeStore>(
  selector?: (state: core.ThemeStore) => T,
): Solid.Accessor<T> {
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
}: Solid.ParentProps<
  Partial<core.TanstackThemesConfig> & {
    defaultBase?: core.ThemeBase;
    defaultAccent?: core.ThemeAccent;
  }
>): Solid.JSX.Element {
  const mode = useTheme((state) => state.mode);

  const configWithDefaults = {
    ...core.getConfigValue(),
    ...config,
  };

  Solid.onMount(() =>
    core.hydrateStore(configWithDefaults, defaultBase, defaultAccent),
  );

  Solid.createEffect(() => {
    core.setConfig(config);
  });

  Solid.createEffect(() => {
    if (mode() !== "auto") return;
    const cleanup = core.setupPreferredListener();
    Solid.onCleanup(cleanup);
  });

  return ScriptOnce({
    children: core.getThemeDetectorScript(configWithDefaults),
  });
}

/**
 * Hook to get the attributes for the html element.
 * @remarks You only need to use this if you are dynamically setting properties on the html element.
 * @returns The attributes for the html element.
 */
export function useHtmlAttributes(): Solid.Accessor<
  Solid.JSX.IntrinsicElements["html"]
> {
  const isHydrated = useHydrated();
  const mode = useTheme((state) => state.mode);
  const scheme = useTheme((state) => state.resolvedMode);
  return Solid.createMemo(() => {
    if (!isHydrated()) {
      // If store is not yet hydrated, don't apply any props. The script will
      // handle the initial DOM state. Just suppress hydration warnings.
      return {
        suppressHydrationWarning: true,
      };
    }
    return {
      class: mode() === "auto" ? `${scheme()} auto` : mode(),
      style: {
        colorScheme: scheme(),
      },
    };
  });
}

/**
 * Hook to get the attributes for the body element.
 * @remarks You only need to use this if you are dynamically setting properties on the body element.
 * @returns The attributes for the body element.
 */
export function useBodyAttributes(): Solid.Accessor<
  Solid.JSX.IntrinsicElements["body"]
> {
  const isHydrated = useHydrated();
  const base = useTheme((state) => state.base);
  const accent = useTheme((state) => state.accent);
  return Solid.createMemo(() => {
    if (!isHydrated()) {
      return {
        suppressHydrationWarning: true,
      };
    }
    return {
      class: `theme-${base()} theme-${accent()}`,
    };
  });
}
