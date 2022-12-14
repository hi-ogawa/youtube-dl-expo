import { contextBridge, ipcRenderer } from "electron";
import { IPC_CHANNEL, PRELOAD_API_NAME } from "./ipc-common";

function main() {
  contextBridge.exposeInMainWorld(PRELOAD_API_NAME, {
    ipcPostMessage: (request: any) => {
      return ipcRenderer.invoke(IPC_CHANNEL, request);
    },
  });
}

main();
