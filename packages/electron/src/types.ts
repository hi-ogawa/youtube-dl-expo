import path from "path";

export const PRELOAD_JS_PATH = path.resolve(__dirname, "index-preload.cjs");

export const RENDERER_URL = process.env["APP_RENDERER_URL"]!;
