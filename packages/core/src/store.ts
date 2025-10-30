import { Store } from "@tanstack/store";

export interface ThemeStore {
  themeMode: string;
  resolvedTheme: string;
  variant: string;
}

export const store: Store<ThemeStore, (cb: ThemeStore) => ThemeStore> =
  new Store({
    themeMode: "auto",
    resolvedTheme: "light",
    variant: "default",
  });
