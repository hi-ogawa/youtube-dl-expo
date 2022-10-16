import { IpcHandler, IpcServer } from "@-/common";

const ipcHandler: IpcHandler = {
  async ["fetch-proxy"]({ fetchArgs }) {
    const res = await fetch(...fetchArgs);
    const data = await res.text();
    return { data };
  },
};

export const ipcServer = new IpcServer(ipcHandler);
