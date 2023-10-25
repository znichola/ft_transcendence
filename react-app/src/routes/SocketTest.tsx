import { useState, useEffect } from "react";
import { socketSetHeadersAndReConnect, dmSocket } from "../socket";
import { useAuth } from "../functions/contexts";
import { useQueryClient } from "@tanstack/react-query";
import { setStatus } from "../api/queryMutations";

export default function SocketTest() {
  return (
    <>
      <div>Socket test page!</div>
      <App />
    </>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(dmSocket.connected);
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

    dmSocket.on("connect", onConnect);
    dmSocket.on("disconnect", onDisconnect);

    return () => {
      dmSocket.off("connect", onConnect);
      dmSocket.off("disconnect", onDisconnect);
    };
  }, [qc, user]);

  return (
    <div className="App">
      <UpdateHeaders />
      <ConnectionState isConnected={isConnected} />
      <ConnectionManager />
      <MyForm />
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
      <button className="m-2 border-2 p-2" onClick={() => dmSocket.connect()}>
        Connect
      </button>
      <button
        className="m-2 border-2 p-2"
        onClick={() => dmSocket.disconnect()}
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
        socketSetHeadersAndReConnect();
        setStatus(qc, user, "ONLINE");
      }}
    >
      socket manager reconnect
    </button>
  );
}


function MyForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    dmSocket.emit("message", value, () => {
      setIsLoading(false);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={(e) => setValue(e.target.value)} />

      <button className="m-2 border-2 p-1" type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}