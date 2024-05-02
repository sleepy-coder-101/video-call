import { io } from "socket.io-client";
export const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
console.log("Socket.IO client instance created");

socket.on("connect", () => {
  console.log("Connected to Socket.io server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.io server");
});
