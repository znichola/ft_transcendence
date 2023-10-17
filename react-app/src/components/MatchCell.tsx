import PongApp from "../pong/PongApp";

export function MatchCell({ victory }: { victory: boolean }) {
  return (
    <div className="h-fit w-fit rounded-xl border-b-2 border-stone-300 bg-stone-50 p-3 shadow">
      <div
        className={`${
          victory ? "text-green-500" : "text-red-600"
        } text-center font-semibold`}
      >
        {victory ? "Victory" : "Defeat"}
      </div>
      <div className={`h-fit w-fit rounded bg-stone-50 p-2`}>
        <span className="ml-1 w-full font-light">
          vs <span className="font-bold">player</span>
        </span>
        <div className="h-fit w-fit rounded-xl  border-4 border-stone-500 bg-stone-700">
          <div className="min-h-[104px] min-w-[170px] TODO:SupprimerCeDiv"></div>
          {/* <PongApp width={170} height={104} /> TODO: ajouter mini pong */}
        </div>
        <div className="flex gap-1">
          <span className="w-full text-right font-bold">7</span>
          <span className="w-full text-center">/</span>
          <span className="w-full text-left font-bold">10</span>
        </div>
      </div>
    </div>
  );
}