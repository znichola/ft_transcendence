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
  const [xIsNext, setXIsNext] = useState(true);
  // const [squares, setSquares] = useState([
  //   ...Array.from({ length: 10 }, (_, i) => (i++).toString()),
  // ]);
  const [squares, setSquares] = useState([...Array(10).fill("・")]);

  const winner = calculateWinner(squares);

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

  return (
    <div className="w-80 resize overflow-auto border-8 ring-offset-8">
      <div className="bg-red-400 p-2 border-b-4">
        <h2 className="text-3xl font-semibold text-slate-700 p-2 capitalize">
          {winner == "X" || winner == "O"
            ? winner + " is the winner"
            : "play tick tack toe"}
        </h2>
      </div>
      <div className="bg-blue-300 p-2 h-max">
        <div>
          <Square
            value={squares[0]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(0)}
          />
          <Square
            value={squares[1]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(1)}
          />
          <Square
            value={squares[2]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(2)}
          />
        </div>

        <div>
          <Square
            value={squares[3]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(3)}
          />
          <Square
            value={squares[4]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(4)}
          />
          <Square
            value={squares[5]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(5)}
          />
        </div>
        <div>
          <Square
            value={squares[6]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(6)}
          />
          <Square
            value={squares[7]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(7)}
          />
          <Square
            value={squares[8]}
            nextValue={xIsNext ? "X" : "O"}
            onSquareClick={() => handleClick(8)}
          />
        </div>
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
      } border-4 border-slate-700 h-20 w-20 hover:border-red-400 m-1 bg-amber-50`}
    >
      <span className="hidden group-hover:contents"> {value == "X" || value == "O" ? value : nextValue} </span>
      <span className="contents group-hover:hidden"> {value} </span>
    </button>
  );
}9

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
