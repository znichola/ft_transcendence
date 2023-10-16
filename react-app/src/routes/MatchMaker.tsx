import BoxMenu from "../components/BoxMenu";
import { Heading } from "../components/FormComponents";
import PongApp from "../pong/PongApp";
import { Link } from "react-router-dom";

function GameMode({
  className,
  title,
  to,
  children,
}: {
  className: string;
  title: string;
  to: string;
  children?: JSX.Element[] | JSX.Element;
}) {
  return (
    <Link
      className={
        "flex h-[32.3rem] w-[20rem] flex-col items-center rounded-xl p-4 transition-all duration-500 hover:scale-110 " +
        className
      }
      to={to}
    >
      <h2 className="text-4xl font-bold text-white">{title}</h2>
      {children}
    </Link>
  );
}

export default function MatchMaker() {
  return (
    <div className="relative flex h-full w-full items-center justify-center pt-16">
      <BoxMenu heading={<Heading title="Select your Game Mode" />}></BoxMenu>
      <div className="flex h-fit w-fit gap-36 p-10">
        <GameMode
          className="bg-stone-800 group"
          title="Classical"
          to="/play/classical"
        >
          <div className="flex h-full w-full pt-10 px-3 ">
            <div className="h-full">
              <div className="transition-all duration-1000 h-20 w-3 bg-white rounded-md translate-y-12 group-hover:translate-y-28"/>
            </div>
            <div className="grow">
              <div className="transition-all duration-1000 h-6 w-6 bg-white rounded-full translate-x-24 translate-y-32 group-hover:translate-x-44 group-hover:translate-y-44"/>
            </div>
            <div className="h-full">
              <div className="transition-all duration-1000 h-20 w-3 bg-white rounded-md translate-y-64 group-hover:translate-y-40"/>
            </div>
          </div>
        </GameMode>
        <GameMode
          className="bg-gradient-to-br from-fuchsia-600 to-orange-500 group"
          title="Special"
          to="/play/special"
        >
          <div className="relative transition-all flex items-center justify-center overflow-hidden w-full h-full pb-7 px-3 text-white text-[19rem] font-bold">
            <h2 className="absolute transition-all duration-[1200ms] group-hover:opacity-0">
              ?
            </h2>
            <h2 className="absolute transition-all duration-[1200ms] opacity-0 group-hover:opacity-100">
              !
            </h2>
          </div>
        </GameMode>
      </div>
    </div>
  );
}
