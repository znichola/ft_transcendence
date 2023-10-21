import { Manager } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

// export const statusSocket = io(`ws://${import.meta.env.VITE_IP_ADDR}:3000`, {
//   autoConnect: false,
// });

export const socketManager = new Manager(
  `ws://${import.meta.env.VITE_IP_ADDR}:3000`,
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

export const userSocket = socketManager.socket("/user"); // main namespace
export const pongSocket = socketManager.socket("/pong"); // pong stuff ?

export const socketSetHeadersAndReConnect = (headerData: string) => {
  if (!userSocket.connected || !pongSocket.connected) {
    userSocket.io.opts.transportOptions = {
      polling: {
        extraHeaders: {
          User: headerData,
          // Authorization: access_token
        },
      },
    };
    userSocket.disconnect().connect();
    pongSocket.disconnect().connect();
  }
};

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
