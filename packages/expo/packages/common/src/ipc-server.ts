import {
  IPC_CLIENT_RECEIVE_FUNCTION,
  IpcHandler,
  IpcRequestMessage,
  IpcResponseMessage,
} from "./ipc";

export class IpcServer {
  constructor(private ipcHandler: IpcHandler) {}

  async handle(message: IpcRequestMessage): Promise<IpcResponseMessage> {
    let ok = true;
    let data;
    try {
      if (message.endpoint in this.ipcHandler) {
        data = await (this.ipcHandler as any)[message.endpoint](message.data);
      } else {
        throw new Error("invalid endpoint");
      }
    } catch (e) {
      data = e;
      ok = false;
    }
    return {
      id: message.id,
      ok,
      data,
    };
  }
}

export function toIpcClientReceiveEval(message: IpcResponseMessage): string {
  return `${IPC_CLIENT_RECEIVE_FUNCTION}(${JSON.stringify(message)})`;
}
