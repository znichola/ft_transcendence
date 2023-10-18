import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

export const statusSocket = io(`ws://${import.meta.env.VITE_IP_ADDR}:3000`);
