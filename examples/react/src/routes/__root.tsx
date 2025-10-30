/// <reference types="vite/client" />
import * as React from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ThemeProvider, getThemeColorMetaTags } from "@tanstack-themes/react";
import { THEME_COLOR_MAP } from "../themes";

export const Route = createRootRoute({
  head: () => {
    const themeColorMetaTags = getThemeColorMetaTags(THEME_COLOR_MAP);
    console.log("running head. Meta tags:", themeColorMetaTags);
    return {
      links: [{ rel: "stylesheet", href: appCss }],
      meta: [...themeColorMetaTags],
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider themeColorMap={THEME_COLOR_MAP} />
        {children}
        <Scripts />
      </body>
    </html>
  );
}
