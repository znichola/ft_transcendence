import { useState, useEffect } from "react";
import { socketSetHeadersAndReConnect, userSocket } from "../socket";
import { useAuth } from "../functions/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { setStatus } from "../api/apiHooks";

export default function SocketTest() {
  return (
    <>
      <div>Socket test page!</div>
      <App />
    </>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(userSocket.connected);
  const qc = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setStatus(qc, user, "ONLINE");
    }

    function onDisconnect() {
      setIsConnected(false);
      setStatus(qc, user, "OFFLINE");
    }

    userSocket.on("connect", onConnect);
    userSocket.on("disconnect", onDisconnect);

    return () => {
      userSocket.off("connect", onConnect);
      userSocket.off("disconnect", onDisconnect);
    };
  }, [qc, user]);

  return (
    <div className="App">
      <UpdateHeaders />
      <ConnectionState isConnected={isConnected} />
      <ConnectionManager />
    </div>
  );
}

function ConnectionState({ isConnected }: { isConnected: boolean }) {
  return (
    <p>
      Connection state: <b>{"" + isConnected}</b>{" "}
    </p>
  );
}

function ConnectionManager() {
  return (
    <>
      <button className="m-2 border-2 p-2" onClick={() => userSocket.connect()}>
        Connect
      </button>
      <button
        className="m-2 border-2 p-2"
        onClick={() => userSocket.disconnect()}
      >
        Disconnect
      </button>
    </>
  );
}

function UpdateHeaders() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return (
    <button
      className="m-2 border-2 p-1"
      onClick={() => {
        socketSetHeadersAndReConnect(user);
        setStatus(qc, user, "ONLINE");
      }}
    >
      socket manager reconnect
    </button>
  );
}
