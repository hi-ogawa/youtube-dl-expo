import { IpcClient } from "@-/common";

export const ipcClient = new IpcClient(
  ReactNativeWebView.postMessage.bind(ReactNativeWebView)
);
ipcClient.expose(window);
