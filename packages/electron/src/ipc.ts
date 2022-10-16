import { IpcHandler, IpcServer } from "@-/common";
import { ipcMain } from "electron";
import undici from "undici";
import { IPC_CHANNEL } from "./ipc-common";

export function setupIpcMain() {
  ipcMain.handle(IPC_CHANNEL, (_event, arg) => {
    return ipcServer.handle(arg);
  });
}

const ipcHandler: IpcHandler = {
  async ["fetch-proxy"]({ fetchArgs }) {
    const res = await undici.fetch(...(fetchArgs as [any]));
    const data = await res.text();
    return { data };
  },
};

const ipcServer = new IpcServer(ipcHandler);
