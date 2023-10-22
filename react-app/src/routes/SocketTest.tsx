import { useState, useEffect } from "react";
import { userSocket } from "../socket";
import { useAuth } from "../functions/useAuth";

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
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // don't understand what this does
    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    userSocket.on("connect", onConnect);
    userSocket.on("disconnect", onDisconnect);
    userSocket.on("foo", onFooEvent);

    return () => {
      userSocket.off("connect", onConnect);
      userSocket.off("disconnect", onDisconnect);
      userSocket.off("foo", onFooEvent);
    };
  }, []);

  return (
    <div className="App">
      <UpdateHeaders />
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
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

function Events({ events }: { events: string[] }) {
  return (
    <ul>
      {events.map((e, index: number) => (
        <li key={index}>{e}</li>
      ))}
    </ul>
  );
}

function ConnectionManager() {
  function connect() {
    userSocket.connect();
  }

  function disconnect() {
    userSocket.disconnect();
  }

  return (
    <>
      <button className="m-2 border-2 p-2" onClick={connect}>
        Connect
      </button>
      <button className="m-2 border-2 p-2" onClick={disconnect}>
        Disconnect
      </button>
    </>
  );
}

function MyForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    userSocket.timeout(5000).emit("create-something", value, () => {
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

function UpdateHeaders() {
  const foo = useAuth();
  if (!foo) return <p className="border-2 p-1">Problem with current user auth</p>;
  return (
    <button
      className="m-2 border-2 p-1"
      onClick={() => {
        userSocket.io.opts.transportOptions = {
          polling: {
            extraHeaders: {
              User: foo.user,
            },
          },
        };
        // statusSocket.io.opts.extraHeaders = { User: "default42" };
        userSocket.disconnect().connect();
      }}
    >
      socket manager reconnect
    </button>
  );
}

// SocketManager(socketURL: URL(string: BaseURL)!, config: [.log(true), .compress, .extraHeaders(["token": getStringValue(key: UserDefaultKeys.loginToken)]), .reconnects(true), .forceWebsockets(true), .forcePolling(true), .forceNew(true)])
