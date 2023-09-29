import PongApp from "../pong/PongApp";

export default function PlayPong() {
  return (
    <>
      <div>
        <h1 className="text-rose-50 text-4xl bg-gradient-to-tl from-rose-400 to-sky-400 p-10 rounded-full px-20 shadow-2xl font-bold ">
          Wanna Play Some Pong?
        </h1>
        <div className="h-8"/>
          <div className="bg-gradient-to-br from-blue-400 to-lime-400  border-2 border-stone-600 shadow-2xl text-sky-200 rounded-xl ">
              <PongApp width={858} height={525}/>
          </div>
      </div>
    </>
  );
}

// for resizing
// https://codesandbox.io/s/resizing-canvas-with-react-hooks-gizc5?file=/src/index.js