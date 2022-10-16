import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNEL, PRELOAD_API_NAME } from "./ipc-common";

function main() {
  contextBridge.exposeInMainWorld(PRELOAD_API_NAME, {
    ipcPostMessage: (message: string) =>
      ipcRenderer.invoke(IPC_CHANNEL, message),
  });
}

main();
