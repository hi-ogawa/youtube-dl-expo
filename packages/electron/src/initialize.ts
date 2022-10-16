import { BrowserWindow } from "electron";
import { createApplicationMenu } from "./application-menu";
import { addContextMenuHandler } from "./context-menu";
import { setupIpcMain } from "./ipc";
import { PRELOAD_JS_PATH, RENDERER_URL } from "./types";

export async function initialize() {
  setupIpcMain();
  createApplicationMenu();
  await createWindow();
}

async function createWindow(): Promise<BrowserWindow> {
  const window = new BrowserWindow({
    webPreferences: {
      preload: PRELOAD_JS_PATH,
    },
  });
  window.webContents.once("dom-ready", () => {
    addContextMenuHandler(window);
  });
  await window.loadURL(RENDERER_URL);
  return window;
}
