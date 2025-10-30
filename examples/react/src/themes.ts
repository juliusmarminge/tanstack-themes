import type { ThemeColorMap } from "@tanstack-themes/react";

export const THEMES = ["default", "t3chat", "catpuccin"] as const;
export type ThemeVariant = (typeof THEMES)[number];

declare module "@tanstack-themes/react" {
  interface Register {
    variant: (typeof THEMES)[number];
  }
}

export const THEME_COLOR_MAP: ThemeColorMap = {
  "default-light": "#ffffff",
  "default-dark": "#000000",
  "t3chat-light": "#ffffff",
  "t3chat-dark": "#000000",
  "catpuccin-light": "#ffffff",
  "catpuccin-dark": "#000000",
};
