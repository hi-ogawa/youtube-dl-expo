//
// IPC system (TODO: move to common package)
//

interface IpcDefinition {
  "fetch-proxy": {
    request: {
      fetchArgs: Parameters<typeof fetch>;
    };
    response: {
      data: string;
    };
  };
}

type IpcEndpoint = keyof IpcDefinition;

interface IpcRequestMessage {
  id: string;
  endpoint: string;
  data: any;
}

interface IpcResponseMessage {
  id: string;
  ok: boolean;
  data: any;
}

let g_ipcRequestId = 1;

export function invokeIpc<T extends IpcEndpoint>(
  endpoint: T,
  request: IpcDefinition[T]["request"]
): Promise<IpcDefinition[T]["response"]> {
  const id = String(++g_ipcRequestId);
  const message: IpcRequestMessage = {
    id,
    endpoint,
    data: request,
  };
  return new Promise((resolve, reject) => {
    g_ipcReceiver.pendings[id] = (message) => {
      if (message.ok) {
        resolve(message.data);
      } else {
        reject(message.data);
      }
    };
    ReactNativeWebView.postMessage(JSON.stringify(message));
  });
}

class IpcReceiver {
  pendings: { [id: string]: (message: IpcResponseMessage) => void } = {};

  receive = (message: IpcResponseMessage) => {
    this.pendings[message.id]?.(message);
    delete this.pendings[message.id];
  };
}

// expose globally for embedder
const g_ipcReceiver = new IpcReceiver();
const IPC_RECEIVE_FUNCTION = "__IPC_RECEIVE__";
Object.assign(window, { [IPC_RECEIVE_FUNCTION]: g_ipcReceiver.receive });
