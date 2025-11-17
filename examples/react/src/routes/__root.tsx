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
  useBodyAttributes,
  useHtmlAttributes,
} from "@tanstack-themes/react";
import { THEME_COLOR_MAP } from "../lib/themes";
import { seoLinks, seoMeta } from "../lib/seo";

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
        localStorageKeyPrefix="tst1-theme-"
      />
      <RootDocument>
        <Outlet />
      </RootDocument>
    </>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const htmlAttributes = useHtmlAttributes();
  const bodyAttributes = useBodyAttributes();

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <HeadContent />
      </head>
      <body {...bodyAttributes}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
