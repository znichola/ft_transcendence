import { Link, Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu.tsx";
import { useEffect, useRef, useState } from "react";

// side nav
export default function Root() {

  const [hide, setHide] = useState(false);
  const sideMenuRef = useRef<HTMLDivElement>(null);

  useEffect(()=> {

    function handleOutsideClick(e: MouseEvent) {
      if (window.innerWidth < 1024 && sideMenuRef.current && !hide && e.target instanceof Node && !sideMenuRef.current.contains(e.target)) {
        setHide(true);
      }
    }

    window.addEventListener('click', handleOutsideClick);

    return(() => {
      window.removeEventListener('click', handleOutsideClick);
    });
  })

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-stone-200">
      <div className={"left-0 right-auto absolute z-10 h-screen w-screen transition-all duration-500 " + (hide ? "backdrop-blur-none pointer-events-none" : "backdrop-blur-sm lg:backdrop-blur-none lg:pointer-events-none")}>
        <SideMenu reference={sideMenuRef} hide={hide} toggleHide={() => {setHide(!hide)}}/>
      </div>
      <div className={"transition-all duration-500 " + (hide ? " min-w-0 " : " lg:min-w-[18rem] ")}/>
      <div className="flex min-w-0 grow w-full h-screen xl:justify-center">
        <div className="flex min-w-0 h-full w-full flex-col xl:max-w-6xl items-center justify-center bg-stone-100 text-slate-600">
          <Outlet />
        </div>
      </div>
    </div>
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
