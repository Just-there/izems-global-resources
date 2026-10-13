// Standalone Vite config — no hosting-vendor plugins.
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

// Nitro preset: Vercel sets VERCEL=1 automatically. Override with DEPLOY_PRESET
// (e.g. "node-server", "netlify"). Defaults to a Cloudflare-style worker in dist/.
const preset = process.env.DEPLOY_PRESET ?? (process.env.VERCEL ? "vercel" : "cloudflare-module");
// Vercel needs its own output folder; every other target writes to dist/.
const output = preset === "vercel" ? {} : { output: { dir: "dist" } };

export default defineConfig(({ command }) => ({
  server: { host: "::", port: 8080 },
  resolve: { dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"] },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart({ server: { entry: "server" } }),
    ...(command === "build" ? [nitro({ preset, ...output })] : []),
    viteReact(),
  ],
}));
