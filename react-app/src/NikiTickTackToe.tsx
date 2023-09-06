// import { useState } from "react";

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
  return (
    <>
      <div className="">
        <Square value={"1"} />
        <Square value={"2"} />
        <Square value={"3"} />
      </div>

      <div>
        <Square value={"4"} />
        <Square value={"5"} />
        <Square value={"6"} />
      </div>
      <div>
        <Square value={"7"} />
        <Square value={"8"} />
        <Square value={"9"} />
      </div>
    </>
  );
}

function Square({ value }: { value: string }) {
  return (
    <button className=" text-5xl font-bold text-slate-700 border-4 border-slate-700 h-20 w-20 hover:border-red-400 m-1 bg-amber-50">
      {value}
    </button>
  );
}
