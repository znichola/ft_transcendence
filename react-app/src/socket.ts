import { Manager, io } from "socket.io-client";
import { getUserToken } from "./api/axios";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : `${import.meta.env.VITE_SITE_URL}`;

// export const statusSocket = io(`wss://${import.meta.env.VITE_SITE_DOMAIN}`, {
//   autoConnect: false,
// });

export const socketManager = new Manager(
  `wss://${import.meta.env.VITE_SITE_DOMAIN}`,
  {
    autoConnect: false,
    transportOptions: {
      polling: {
        extraHeaders: {
          User: "test",
        },
      },
    },
  },
);

export const userSocket = socketManager.socket("/"); // main namespace
export const pongSocket = socketManager.socket("/pong"); // pong stuff ?
export const dmSocket = socketManager.socket("/dm"); // pong stuff ?
export const chatroomSocket = socketManager.socket("/chatroom"); // pong stuff ?

export const socketSetHeadersAndReConnect = async () => {
  if (!userSocket.connected || !pongSocket.connected) {
    const access_token = await getUserToken();
    userSocket.auth = { token: access_token };
    pongSocket.auth = { token: access_token };
    userSocket.disconnect().connect();
    pongSocket.disconnect().connect();
    dmSocket.disconnect().connect();
    chatroomSocket.disconnect().connect();
  }
};

export function socketDisconnect() {
  userSocket.disconnect();
  pongSocket.disconnect(); 
  dmSocket.disconnect(); 
  chatroomSocket.disconnect(); 
}

export function socketCcnnect() {
  userSocket.connect();
  pongSocket.connect(); 
  dmSocket.connect(); 
  chatroomSocket.connect(); 
}

// Step 1:- Create manager >
// manager = SocketManager(socketURL: URL(string: BaseURL)!, config: [.log(true), .compress, .extraHeaders(["token": getStringValue(key: UserDefaultKeys.loginToken)]), .reconnects(true), .forceWebsockets(true), .forcePolling(true), .forceNew(true)])

// Step 2:- socket = manager.defaultSocket

// Step3:- manager.reconnect()
// manager.setConfigs([.extraHeaders(accessToken), .reconnects(true), .forcePolling(true)])
// socket.connect()

// how to deal with updating socket information
// https://github.com/socketio/socket.io-client-swift/issues/958

// socket manager
// https://socket.io/docs/v4/client-api/
