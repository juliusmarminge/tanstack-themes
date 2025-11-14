/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRoute } from "@tanstack/solid-router";
import { HydrationScript } from "solid-js/web";
import type * as Solid from "solid-js";
import { splitProps } from "solid-js";
import appCss from "../styles.css?url";
import {
  getThemeColorMetaTags,
  ThemeProvider,
  useThemeProps,
} from "@tanstack-themes/solid";
import { twMerge } from "tailwind-merge";
import { THEME_COLOR_MAP } from "../lib/themes";
import { seoLinks, seoMeta } from "../lib/seo";

export const Route = createRootRoute({
  head: () => {
    const themeColorMetaTags = getThemeColorMetaTags(THEME_COLOR_MAP);
    console.log("Running head, Meta tags:", themeColorMetaTags);
    return {
      links: [{ rel: "stylesheet", href: appCss }, ...seoLinks()],
      meta: [...themeColorMetaTags, ...seoMeta()],
    };
  },
  shellComponent: RootDocument,
});

function RootDocument(props: { children: Solid.JSX.Element }) {
  const themeProps = useThemeProps();

  const [{ class: bodyClass }, themeBodyProps] = splitProps(
    themeProps().bodyProps,
    ["class"],
  );

  console.log("Running root document. Theme props:", themeProps());

  return (
    <html lang="en" {...themeProps().htmlProps}>
      <head>
        <HydrationScript />
      </head>
      <body
        class={twMerge("bg-background text-foreground", bodyClass)}
        {...themeBodyProps}
      >
        <HeadContent />
        {props.children}
        <ThemeProvider themeColorLookup={THEME_COLOR_MAP} />
        <Scripts />
      </body>
    </html>
  );
}
