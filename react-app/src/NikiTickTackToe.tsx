import { useState } from "react";

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  // const [squares, setSquares] = useState([
  //   ...Array.from({ length: 10 }, (_, i) => (i++).toString()),
  // ]);
  const [squares, setSquares] = useState([...Array(10).fill("・")]);

  function handleClick(i: number) {
    const nextSquares = squares.slice();
    if (
      nextSquares[i] == "X" ||
      nextSquares[i] == "O" ||
      calculateWinner(squares)
    )
      return;
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    const nextSquares = [...Array(10).fill("・")];
    setSquares(nextSquares);
  }

  return (
    <div className="min-w-fit min-h-fit w-80 h-100 resize overflow-auto border-8 ring-offset-8 grid">
      <HeaderBTN winner={calculateWinner(squares)} resetBoard={handleReset} />
      <div className="bg-blue-300 min-w-fit min-h-fit grid gap-4 grid-cols-3 grid-rows-3 p-4">
        {[...Array(9)].map((_, i) => (
          <Square
            key={i}
            value={squares[i]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </div>
  );
}

function Square({
  value,
  nextValue,
  onSquareClick,
}: {
  value: string;
  nextValue: string;
  onSquareClick: () => void;
}) {
  return (
    <button
      onClick={onSquareClick}
      className={`group text-5xl font-bold ${
        value == "X" || value == "O" ? "text-slate-700" : "text-stone-300"
      } border-4 border-slate-700 h-20 w-20 hover:border-red-400 bg-amber-50`}
    >
      <span className="hidden group-hover:contents">
        {" "}
        {value == "X" || value == "O" ? value : nextValue}{" "}
      </span>
      <span className="contents group-hover:hidden"> {value} </span>
    </button>
  );
}

function HeaderBTN({
  winner,
  resetBoard,
}: {
  winner: string | null;
  resetBoard: () => void;
}) {
  return (
    <button
      onClick={resetBoard}
      className="group bg-red-400 px-2 py-6 border-b-4 text-3xl font-semibold text-slate-700 capitalize"
    >
      <span className="group-hover:hidden contents ">
        {winner == "X" || winner == "O"
          ? winner + " is the winner"
          : "play Tic-Tac-Toe"}
      </span>
      <span className="group-hover:contents hidden"> click to reset </span>
    </button>
  );
}

function calculateWinner(s: string[]): string | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 9],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if ((s[a] == "X" || s[a] == "O") && s[a] == s[b] && s[b] == s[c])
      return s[a];
  }
  return null;
}
