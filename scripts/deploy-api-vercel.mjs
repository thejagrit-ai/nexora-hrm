#!/usr/bin/env node
/**
 * Builds the core API and deploys it to the Vercel project "nexora-hrm-api"
 * as a serverless function.  Usage:  pnpm deploy:api
 *
 * What it does
 *   1. builds @empcloud/shared and the core API (tsc -> apps/core-api/dist)
 *   2. assembles a self-contained bundle in .deploy-api/ (compiled code, the
 *      shared package, a Vercel handler and routing config)
 *   3. links the bundle to the Vercel project and deploys it to production
 *
 * Runtime settings (database, keys, URLs) live in that Vercel project's
 * environment variables, never in this repo. See `vercel env ls production`.
 *
 * Not available on Vercel: chat sockets, cron jobs, and persistent uploads.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PROJECT = "nexora-hrm-api";
const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, ".deploy-api");
const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: "inherit" });
const copy = (from, to) => fs.cpSync(path.join(root, from), path.join(out, to), { recursive: true });

run("pnpm --filter @empcloud/shared build");
run("pnpm --filter @empcloud/server build");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "api"), { recursive: true });
copy("apps/core-api/dist", "dist");
if (fs.existsSync(path.join(root, "apps/core-api/public"))) copy("apps/core-api/public", "public");
copy("packages/core-shared/dist", "shared/dist");

// Shared package: runtime fields only.
const shared = JSON.parse(fs.readFileSync(path.join(root, "packages/core-shared/package.json"), "utf8"));
delete shared.scripts;
delete shared.devDependencies;
fs.writeFileSync(path.join(out, "shared/package.json"), JSON.stringify(shared, null, 2));

// App package: the API's dependencies, with the workspace package vendored.
const core = JSON.parse(fs.readFileSync(path.join(root, "apps/core-api/package.json"), "utf8"));
fs.writeFileSync(
  path.join(out, "package.json"),
  JSON.stringify(
    {
      name: PROJECT,
      version: "1.0.0",
      private: true,
      type: "module",
      engines: { node: "22.x" },
      dependencies: { ...core.dependencies, "@empcloud/shared": "file:./shared" },
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(out, "api/index.mjs"),
  `// Vercel serverless entry: serves the Express app built by dist/index.js.
import { buildApp } from "../dist/index.js";

let appPromise;
export default async function handler(req, res) {
  appPromise ||= buildApp().catch((err) => { appPromise = undefined; throw err; });
  const app = await appPromise;
  return app(req, res);
}
`,
);

fs.writeFileSync(
  path.join(out, "vercel.json"),
  JSON.stringify(
    {
      rewrites: [{ source: "/(.*)", destination: "/api/index" }],
      // node_modules is listed explicitly: some packages (e.g. swagger-ui-dist)
      // are resolved at runtime, which Vercel's file tracing cannot see.
      functions: { "api/index.mjs": { maxDuration: 60, includeFiles: "{dist,public,node_modules}/**" } },
    },
    null,
    2,
  ),
);

run(`vercel link --yes --project ${PROJECT}`, out);
fs.rmSync(path.join(out, ".env.local"), { force: true }); // token pulled by `link`; not needed to deploy
run("vercel deploy --prod --yes", out);
