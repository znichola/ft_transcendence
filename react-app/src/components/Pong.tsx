export default function Pong() {
  return (
    <div className="p-5">
      <div className="h-[300px] w-[500px] bg-red-500 relative">
        <div className="absolute top-10 left-10">◍</div>
        <div className="flex h-full">
          <div className="grow border-r-2 border-dashed border-rose-400 bg-blue-400">
            <div className="player1" />
            <div className="gate1" />
          </div>
          <div className="grow border-l-2 border-dashed border-rose-400 bg-green-300">
            <div className="player2" />
            <div className="gate2" />
          </div>
        </div>
      </div>
    </div>
  );
}
