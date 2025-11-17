// @ts-nocheck
/// <reference types="vite/client" />
import { fromConfig } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = fromConfig<typeof Config>();

export const docs = await create.docs("docs", "content/docs", import.meta.glob(["./**/*.{json,yaml}"], {
  "base": "./../content/docs",
  "query": {
    "collection": "docs"
  },
  "import": "default",
  "eager": true
}), import.meta.glob(["./**/*.{mdx,md}"], {
  "base": "./../content/docs",
  "query": {
    "collection": "docs"
  },
  "eager": true
}));