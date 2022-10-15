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

type IpcHandler = {
  [K in keyof IpcDefinition]: (
    request: IpcDefinition[K]["request"]
  ) => Promise<IpcDefinition[K]["response"]>;
};

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

export async function handleIpc(
  message: IpcRequestMessage
): Promise<IpcResponseMessage> {
  let ok = true;
  let data;
  try {
    data = await (ipcHandler as any)[message.endpoint](message.data);
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

const ipcHandler: IpcHandler = {
  async ["fetch-proxy"]({ fetchArgs }) {
    console.log({ fetchArgs });
    const res = await fetch(...fetchArgs);
    const data = await res.text();
    return { data };
  },
};

export function toResponseInjection(message: IpcResponseMessage): string {
  return `${IPC_RECEIVE_FUNCTION}(${JSON.stringify(message)})`;
}

const IPC_RECEIVE_FUNCTION = "__IPC_RECEIVE__";
