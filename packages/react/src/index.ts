/**
 * This is the React integration of tanstack-themes.
 * @module
 */
import * as React from "react";
import { useStore } from "@tanstack/react-store";
import { ScriptOnce } from "@tanstack/react-router";
import * as core from "@tanstack-themes/core";

export {
  setTheme,
  setVariant,
  toggleMode,
  type Register,
} from "@tanstack-themes/core";

export function useTheme<T = core.ThemeStore>(
  selector?: (state: core.ThemeStore) => T,
): T {
  return useStore(core.store, selector);
}

export function ThemeProvider(
  _props: React.PropsWithChildren,
): React.ReactNode {
  const mode = useTheme((state) => state.themeMode);

  React.useEffect(() => {
    core.hydrateStore();
    if (mode !== "auto") return;
    return core.setupPreferredListener();
  }, [mode]);

  return ScriptOnce({
    children: core.getThemeDetectorScript({}),
  });
}
