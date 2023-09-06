import { useState } from "react";

// function Square({
//   value,
//   onSquareClick,
// }: {
//   value: string;
//   onSquareClick: () => void;
// }) {
//   return <button onClick={onSquareClick}>{value}</button>;
// }

export default function Board() {
  const [squares, setSquares] = useState([
    ...Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
  ]);
  
  return (
    <>
      <div className="">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>

      <div>
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div>
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}

function Square({ value }: { value: string }) {
  const [svalue, setSValue] = useState<string>(); // explicit type is declared with the <>
  // const [svalue, setSValue] = useState("");    // type is infered from the arguemnt ""

  function handleClick() {
    console.log("clicked!");
    setSValue(svalue ? "" : "X");
  }

  return (
    <button
      onClick={handleClick}
      className={`text-5xl font-bold ${
        svalue ? "text-slate-700" : "text-stone-300"
      } border-4 border-slate-700 h-20 w-20 hover:border-red-400 m-1 bg-amber-50`}
    >
      {svalue || value}
    </button>
  );
}
