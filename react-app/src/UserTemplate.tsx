import { Avatar } from "./Profile";
import { UserData } from "./interfaces";

export default function UserTemplate({ user, url="/patate" }: { user: UserData; url: string }) {
  return (
    <div className="m-4 flex bg-red-100 shadow">
      <Avatar
        size="m-2 mb-3 mt-3 w-16 h-16"
        alt={user?.name}
        status={user?.status}
        img={user?.avatar}
      />

      <div className="flex flex-col content-center justify-center ">
        <p className="font-semibold text-slate-700">{user?.name}</p>
        <p className="text-slate-400">{"@" + user?.login42}</p>
      </div>
    </div>
  );
}
