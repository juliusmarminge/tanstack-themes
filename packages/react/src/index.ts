/**
 * This is the React integration of tanstack-themes.
 * @module
 */
import { store, ThemeStore } from "@tanstack-themes/core";
import { useStore } from "@tanstack/react-store";

export function useTheme(): ThemeStore {
  return useStore(store);
}
