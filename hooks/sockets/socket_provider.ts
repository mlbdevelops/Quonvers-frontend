import { io, Socket } from "socket.io-client";

export const socket: Socket | null | undefined = io('http://127.0.0.1:4000', {
  autoConnect: false,
  transports: ["websocket"],
});