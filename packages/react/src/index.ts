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
  getThemeColorMetaTags,
  type Register,
  type ThemeColorMap,
  type TanstackThemesConfig,
} from "@tanstack-themes/core";

export function useTheme<T = core.ThemeStore>(
  selector?: (state: core.ThemeStore) => T,
): T {
  return useStore(core.store, selector);
}

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
