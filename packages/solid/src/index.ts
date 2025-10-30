/**
 * This is the Solid.js integration of tanstack-themes.
 * @module
 */
import * as Solid from "solid-js";
import { useStore } from "@tanstack/solid-store";
import { ScriptOnce } from "@tanstack/solid-router";
import * as core from "@tanstack-themes/core";

export { setTheme, setVariant, toggleMode } from "@tanstack-themes/core";

export function useTheme<T = core.ThemeStore>(
  selector?: (state: core.ThemeStore) => T,
): Solid.Accessor<T> {
  return useStore(core.store, selector);
}

export function ThemeProvider(_props: Solid.ParentProps): Solid.JSX.Element {
  const mode = useTheme((state) => state.themeMode);

  Solid.onMount(core.hydrateStore);

  Solid.createEffect(() => {
    if (mode() !== "auto") return;
    const cleanup = core.setupPreferredListener();
    Solid.onCleanup(cleanup);
  });

  return ScriptOnce({
    children: core.getThemeDetectorScript(
      core.THEME_MODE_KEY,
      core.THEME_VARIANT_KEY,
      core.VALID_THEME_VARIANTS,
      {},
    ),
  });
}
