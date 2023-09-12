import { Link, Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu.tsx";

// side nav
export default function Root() {
  return (
    <>
      <div className="flex">
        <div id="side-bar" className="inline-block ">
          <div className="w-64 "></div>
          <SideMenu />
        </div>
        <div id="page0-content" className="flex items-center h-screen w-screen justify-center bg-stone-100">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export function SideBar() {
  return (
    <div className="absolute flex min-h-screen w-64 flex-col justify-between bg-slate-200 pb-5 shadow-lg">

      <nav className="flex flex-col pt-5 capitalize sm:justify-center">
        {[
          ["Home", "/"],
          ["login", "/login"],
          ["profile", "/profile"],
          ["fetch-user", "/fetch-user"],
          ["tic tac toe", "/ttt"],
          ["app", "/app"],
          ["all users", "/user"],
        ].map(([title, url]) => (
          <Link
            to={url}
            key={title}
            className="text-l tran px-3 py-2 pl-8 font-medium text-slate-700 transition delay-100 ease-in-out hover:translate-x-2 hover:bg-amber-100 hover:text-red-500 hover:shadow"
          >
            {title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
