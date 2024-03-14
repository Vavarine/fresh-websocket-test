import { type Signal, useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx";
import { useEffect } from "preact/hooks";

export default function Counter() {
  const count = useSignal(0);

  useEffect(() => {
    const hostName = window.location.hostname;
    const port = window.location.port;

    const socketUrl = `ws://${hostName}:${port}/api/ws`;
    console.log("url", socketUrl);
    const socket = new WebSocket(socketUrl);

    // const socket = new WebSocket("ws://localhost:8001/api/ws");
    // const listener = (e: MessageEvent) => {
    //   const msg: ChannelMessage = JSON.parse(e.data);
    //   dispatch(msg);
    // };

    const handleOpen = (event: Event) => {
      // console.log("open");
      // console.info(event);
    };

    const handleMessage = (event: MessageEvent) => {
      // console.log("handle message");
      // console.log(event);
      count.value = parseInt(event.data);
    };

    const handleError = (event: Event) => {
      console.error(event);
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("error", handleError);
    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("error", handleError);
      socket.close();
    };
  }, []);

  return (
    <div class="flex gap-8 py-6">
      <div>
        simultaneous connections: <strong>{count.value}</strong>
      </div>
    </div>
  );
}
