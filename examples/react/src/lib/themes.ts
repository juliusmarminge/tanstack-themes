import type { ThemeColorMap } from "@tanstack-themes/react";

export const BASE_COLORS = ["stone", "zinc", "slate"] as const;
export type BaseColor = (typeof BASE_COLORS)[number];

export const ACCENT_COLORS = [
  "default",
  "sapphire",
  "emerald",
  "amber",
  "mono",
] as const;
export type AccentColor = (typeof ACCENT_COLORS)[number];

declare module "@tanstack-themes/react" {
  interface Register {
    base: BaseColor;
    accent: AccentColor;
  }
}

// These are the `--background` colors but in JS land as RGB hex values
export const THEME_COLOR_MAP: ThemeColorMap = {
  "stone-light": "#FFFFFF",
  "stone-dark": "#0C0A09",
  "zinc-light": "#FFFFFF",
  "zinc-dark": "#09090B",
  "slate-light": "#FFFFFF",
  "slate-dark": "#020618",
};
