import { IPC_CLIENT_RECEIVE_FUNCTION, IpcClient } from "@-/common";

// packages/electron/src/ipc-common.ts
const PRELOAD_API_NAME = "__PRELOAD_API__";
const PRELOAD_API = (globalThis as any)[PRELOAD_API_NAME];

// https://github.com/react-native-webview/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native
declare const ReactNativeWebView: {
  postMessage: (data: string) => void;
};

let postMessage: (message: string) => void;

if (PRELOAD_API) {
  postMessage = async (message: string) => {
    const response = await PRELOAD_API.ipcPostMessage(message);
    (globalThis as any)[IPC_CLIENT_RECEIVE_FUNCTION](response);
  };
} else {
  postMessage = ReactNativeWebView.postMessage.bind(ReactNativeWebView);
}

export const ipcClient = new IpcClient(postMessage);
ipcClient.expose(globalThis);
