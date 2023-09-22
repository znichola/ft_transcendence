import { Link } from "react-router-dom";
import { UserData } from "../interfaces";
import Avatar from "./Avatar";

export default function UserInfoCard({ user }: { user: UserData }) {
  return (
    <div className="m-4 flex max-h-24 max-w-md bg-white shadow">
      <div className="group relative w-20 items-center justify-center overflow-hidden border-r border-slate-200  ">
        <div className="absolute flex h-24 min-w-full grow items-center justify-center overflow-hidden duration-500 group-hover:opacity-0">
          <div className="font-bold text-slate-500">{user.elo}</div>
        </div>
        <div className="flex h-full w-full items-center justify-center">
          <div className="absolute flex h-0 min-w-full flex-col items-center justify-center overflow-hidden bg-stone-100 transition-all duration-500 group-hover:h-24 group-hover:shadow-inner">
            <div className="font-bold text-green-400">{user.wins + "W"}</div>
            <div className=" text-slate-400">-</div>
            <div className=" text-red-300">
              {user.losses + "L"}
            </div>
          </div>
        </div>
      </div>
      <Avatar
        size="m-2 mb-3 mt-3 w-16 h-16"
        alt={user.name}
        status={user.status}
        img={user.avatar}
      />

      <div className="flex flex-col content-center justify-center ">
        <p className="font-semibold text-slate-700">{user.name}</p>
        <Link to={"/user/" + user.login42} className="text-slate-400">
          {"@" + user.login42}
        </Link>
      </div>
    </div>
  );
}
