import { IconMegaphone } from "../components/Icons";

export default function PongFeed() {
  return (
    <>
      <button onClick={() => console.log("Clicked button")}>
        <div className="flex content-center justify-center rounded-full border border-stone-500 bg-gradient-to-r from-indigo-500 to-rose-500 p-8 shadow-xl">
          <IconMegaphone className="h-16 w-16 text-stone-50" strokeWidth={1} />
          <div className="w-5" />
          <h1 className="text-2xl font-light text-stone-50">
            Have something to say?
            <br /> <b className="font-semibold">Pong</b> it to the world!
          </h1>
        </div>
      </button>
    </>
  );
}
