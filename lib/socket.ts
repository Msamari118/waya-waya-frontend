// lib/socket.ts
import { io } from "socket.io-client";

// Simple socket connection for real-time chat
const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
  transports: ["websocket", "polling"],
  autoConnect: false
});

export default socket;