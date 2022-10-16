import {
  IPC_CLIENT_RECEIVE_FUNCTION,
  IpcDefinition,
  IpcEndpoint,
  IpcRequestMessage,
  IpcResponseMessage,
} from "./ipc";

export class IpcClient {
  private lastRequestId = 0;
  private pendings: { [id: string]: (message: IpcResponseMessage) => void } =
    {};

  constructor(private postMessage: (message: IpcRequestMessage) => void) {}

  async invokeIpc<T extends IpcEndpoint>(
    endpoint: T,
    request: IpcDefinition[T]["request"]
  ): Promise<IpcDefinition[T]["response"]> {
    const id = String(++this.lastRequestId);
    return new Promise((resolve, reject) => {
      this.pendings[id] = (responseMessage: IpcResponseMessage) => {
        if (responseMessage.ok) {
          resolve(responseMessage.data);
        } else {
          reject(responseMessage.data);
        }
      };
      this.postMessage({
        id,
        endpoint,
        data: request,
      });
    });
  }

  // invoked by embedder
  receive = (message: IpcResponseMessage) => {
    this.pendings[message.id]?.(message);
    delete this.pendings[message.id];
  };

  expose(global: any) {
    Object.assign(global, { [IPC_CLIENT_RECEIVE_FUNCTION]: this.receive });
  }
}
