export const THEMES = ["default", "t3chat", "catpuccin"] as const;
export type ThemeVariant = (typeof THEMES)[number];

declare module "@tanstack-themes/react" {
  interface Register {
    variant: (typeof THEMES)[number];
  }
}
