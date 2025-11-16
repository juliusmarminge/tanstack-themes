/// <reference types="vite/client" />
import * as React from "react";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import {
  ThemeProvider,
  getThemeColorMetaTags,
  useThemeProps,
} from "@tanstack-themes/react";
import { THEME_COLOR_MAP } from "../lib/themes";
import { seoLinks, seoMeta } from "../lib/seo";
import { twMerge } from "tailwind-merge";

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }, ...seoLinks()],
    meta: [...getThemeColorMetaTags(THEME_COLOR_MAP), ...seoMeta()],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <ThemeProvider
        themeColorLookup={THEME_COLOR_MAP}
        defaultBase="zinc"
        defaultAccent="emerald"
      />
      <RootDocument>
        <Outlet />
      </RootDocument>
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const themeProps = useThemeProps();
  const { className: bodyClassName, ...themeBodyProps } = themeProps.bodyProps;

  return (
    <html lang="en" {...themeProps.htmlProps}>
      <head>
        <HeadContent />
      </head>
      <body
        className={twMerge("bg-background text-foreground", bodyClassName)}
        {...themeBodyProps}
      >
        {children}
        <Scripts />
      </body>
    </html>
  );
}
