export interface IpcDefinition {
  "fetch-proxy": {
    request: {
      fetchArgs: Parameters<typeof fetch>;
    };
    response: {
      data: string;
    };
  };
}

export type IpcEndpoint = keyof IpcDefinition;

// interface for ipc handler implementation
export type IpcHandler = {
  [K in keyof IpcDefinition]: (
    request: IpcDefinition[K]["request"]
  ) => Promise<IpcDefinition[K]["response"]>;
};

export interface IpcRequestMessage {
  id: string;
  endpoint: string;
  data: any;
}

export interface IpcResponseMessage {
  id: string;
  ok: boolean;
  data: any;
}

export const IPC_CLIENT_RECEIVE_FUNCTION = "__IPC_CLIENT_RECEIVE__";
