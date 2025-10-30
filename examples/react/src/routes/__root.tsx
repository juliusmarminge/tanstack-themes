/// <reference types="vite/client" />
import * as React from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { ThemeProvider, themeColorMetaTags } from "@tanstack-themes/react";
import { THEME_COLOR_MAP } from "../themes";

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
    meta: [...themeColorMetaTags(THEME_COLOR_MAP)],
  }),
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
