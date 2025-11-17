// @ts-nocheck
/// <reference types="vite/client" />
import { fromConfigDynamic } from 'fumadocs-mdx/runtime/dynamic';
import * as Config from '../source.config';

const create = await fromConfigDynamic(Config);