import { context } from "esbuild";

const ctx = await context({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: "inline",
  legalComments: "none",
  tsconfig: "tsconfig.json",
  platform: "browser",
  outdir: "dist",
  target: "esnext",
  format: "esm",
});
await ctx.rebuild();
process.exit();