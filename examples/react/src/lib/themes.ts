import type { ThemeColorMap } from "@tanstack-themes/react";

export const THEMES = ["default", "t3chat", "catpuccin"] as const;
export type ThemeVariant = (typeof THEMES)[number];

declare module "@tanstack-themes/react" {
  interface Register {
    variant: (typeof THEMES)[number];
  }
}

// These are the `--background` colors but in JS land as RGB hex values
export const THEME_COLOR_MAP: ThemeColorMap = {
  "default-light": "#FFFFFF",
  "default-dark": "#0A0A0A",
  "t3chat-light": "#FAF5FA",
  "t3chat-dark": "#221D27",
  "catpuccin-light": "#EFF1F5",
  "catpuccin-dark": "#181825",
};
