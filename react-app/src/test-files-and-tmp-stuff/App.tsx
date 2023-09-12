import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex min-h-screen flex-col text-center">
      <h1 className="py-20 text-center text-5xl font-bold text-slate-800">
        Vite + React
      </h1>
      <div>
        <button
          className="min-w-fit rounded-3xl border border-yellow-200 bg-white px-4 py-2  text-base  font-bold text-yellow-300 shadow-lg hover:border-0 hover:bg-yellow-300 hover:text-white"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
      <footer className="mt-auto p-4 text-slate-400">
        Edit <code>src/App.tsx</code> and save to test HMR
      </footer>
    </div>
  );
}

export default App;
