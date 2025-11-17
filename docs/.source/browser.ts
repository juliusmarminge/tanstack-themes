// @ts-nocheck
/// <reference types="vite/client" />
import { fromConfig } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = fromConfig<typeof Config>();
const browserCollections = {
  docs: create.doc("docs", import.meta.glob(["./**/*.{mdx,md}"], {
    "base": "./../content/docs",
    "query": {
      "collection": "docs"
    },
    "eager": false
  })),
};
export default browserCollections;