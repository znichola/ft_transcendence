import { useState, useEffect } from "react";
import { statusSocket } from "../socket";

export default function SocketTest() {
  return (
    <>
      <div>Socket test page!</div>
      <App />
    </>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(statusSocket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents((previous) => [...previous, value]);
    }

    statusSocket.on("connect", onConnect);
    statusSocket.on("disconnect", onDisconnect);
    statusSocket.on("foo", onFooEvent);

    return () => {
      statusSocket.off("connect", onConnect);
      statusSocket.off("disconnect", onDisconnect);
      statusSocket.off("foo", onFooEvent);
    };
  }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  );
}

function ConnectionState({ isConnected } : { isConnected: boolean} ) {
  return <p>State: {"" + isConnected}</p>;
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
    statusSocket.connect();
  }

  function disconnect() {
    statusSocket.disconnect();
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  );
}

export function MyForm() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    statusSocket.timeout(5000).emit("create-something", value, () => {
      setIsLoading(false);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={(e) => setValue(e.target.value)} />

      <button type="submit" disabled={isLoading}>
        Submit
      </button>
    </form>
  );
}
