const clients = new Map<number, WebSocket>();
let clientId = 0;

function dispatch(msg: Parameters<WebSocket["send"]>[0]): void {
  for (const client of clients.values()) {
    client.send(msg);
  }
}

function wsHandler(ws: WebSocket) {
  const id = ++clientId;
  clients.set(id, ws);

  ws.onopen = () => {
    dispatch(`${clients.size}`);
  };

  ws.onclose = () => {
    clients.delete(id);
    dispatch(`${clients.size}`);
  };
}

export const handler = (req: Request): Response => {
  const { socket, response } = Deno.upgradeWebSocket(req);
  wsHandler(socket);
  return response;
};
