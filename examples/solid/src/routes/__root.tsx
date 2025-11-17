/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRoute } from "@tanstack/solid-router";
import { HydrationScript } from "solid-js/web";
import type * as Solid from "solid-js";
import appCss from "../styles.css?url";
import {
  getThemeColorMetaTags,
  ThemeProvider,
  useBodyAttributes,
  useHtmlAttributes,
} from "@tanstack-themes/solid";
import { THEME_COLOR_MAP } from "../lib/themes";
import { seoLinks, seoMeta } from "../lib/seo";

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }, ...seoLinks()],
    meta: [...getThemeColorMetaTags(THEME_COLOR_MAP), ...seoMeta()],
  }),
  shellComponent: RootDocument,
});

function RootDocument(props: { children: Solid.JSX.Element }) {
  const htmlAttributes = useHtmlAttributes();
  const bodyAttributes = useBodyAttributes();

  return (
    <html lang="en" {...htmlAttributes()}>
      <head>
        <HydrationScript />
      </head>
      <body {...bodyAttributes()}>
        <HeadContent />
        {props.children}
        <ThemeProvider
          themeColorLookup={THEME_COLOR_MAP}
          defaultBase="t3chat"
          localStorageKeyPrefix="tst2-theme-"
        />
        <Scripts />
      </body>
    </html>
  );
}
