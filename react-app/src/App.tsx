import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col min-h-screen text-center">
      <h1 className="text-5xl font-bold text-center py-20 text-slate-800">
        Vite + React
      </h1>
      <div>
        <button
          className="px-4 py-2 text-base text-yellow-300 font-bold rounded-3xl bg-white  shadow-lg  hover:bg-yellow-300 border-yellow-200 hover:border-0 border min-w-fit hover:text-white"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
      <footer className="mt-auto text-slate-400 p-4">
        Edit <code>src/App.tsx</code> and save to test HMR
      </footer>
    </div>
  );
}

export default App;
