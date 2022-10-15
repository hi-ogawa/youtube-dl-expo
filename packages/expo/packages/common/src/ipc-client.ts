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

  constructor(private postMessage: (message: string) => void) {}

  async invokeIpc<T extends IpcEndpoint>(
    endpoint: T,
    request: IpcDefinition[T]["request"]
  ): Promise<IpcDefinition[T]["response"]> {
    const id = String(++this.lastRequestId);
    const requestMessage: IpcRequestMessage = {
      id,
      endpoint,
      data: request,
    };
    return new Promise((resolve, reject) => {
      this.pendings[id] = (responseMessage: IpcResponseMessage) => {
        if (responseMessage.ok) {
          resolve(responseMessage.data);
        } else {
          reject(responseMessage.data);
        }
      };
      this.postMessage(JSON.stringify(requestMessage));
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
