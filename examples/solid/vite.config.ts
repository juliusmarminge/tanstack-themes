import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteSolid from "vite-plugin-solid";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [tanstackStart(), nitro(), tailwindcss(), viteSolid({ ssr: true })],
});
