import type { ThemeColorMap } from "@tanstack-themes/solid";

export const THEMES = ["default", "t3chat", "catpuccin"] as const;
export type ThemeVariant = (typeof THEMES)[number];

declare module "@tanstack-themes/solid" {
  interface Register {
    base: ThemeVariant;
  }
}

export const THEME_COLOR_MAP: ThemeColorMap = {
  "default-light": "#FFFFFF",
  "default-dark": "#0A0A0A",
  "t3chat-light": "#FAF5FA",
  "t3chat-dark": "#221D27",
  "catpuccin-light": "#EFF1F5",
  "catpuccin-dark": "#181825",
};
