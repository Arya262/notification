// src/utils/socket.js
import { io } from "socket.io-client";

// Replace with your backend server URL
const SOCKET_URL = "http://localhost:3000";

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // we'll connect manually
});

export default socket;
