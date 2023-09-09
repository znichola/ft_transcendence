import { Link, Outlet } from "react-router-dom";
import { api } from "../utils.tsx";
import { UserData } from "../interfaces.tsx";
import { useEffect, useState } from "react";
import { Avatar } from "../Profile.tsx";

// side nav
export default function Root() {
  return (
    <>
      <div className="flex">
        <div id="side-bar" className=" inline-block">
          <div className="w-64 "></div>
          <SideBar />
        </div>
        <div id="page0-content" className="grow">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export function TheMasterminds() {
  return (
    <Link
      to="/"
      className="group mt-auto flex flex-col items-center justify-center px-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 159.89 132.24"
        fill="currentColor"
        className="h-10 w-10 fill-slate-700 drop-shadow group-hover:fill-red-500"
      >
        <path d="M75.41.05A35,35,0,0,1,88.26,1.72c9.33,3.12,19.17,3.11,28.66,5,13.62,2.71,24.06,10,29.3,23.43.63,1.61.56,3.54,1.94,4.76,5.33,4.69,12.24,14.51,9.85,24.83a9.12,9.12,0,0,0,.57,4.87c3.61,11.8-.32,22.88-10.52,29.65-1.54,1-3.07,1.79-3.42,3.94-2.07,12.59-18.07,17.8-33.16,16.74-3.56-.25-3.81.8-2.57,4.07a48,48,0,0,1,1.88,6.58c.43,1.89,1.52,4.07-.49,5.6-2.79,2.12-12,.83-14.12-2.12-5.93-8.25-11.92-16.45-17.61-24.86-2.16-3.19-4.46-4.38-8.32-3.61-6.94,1.38-12.9-.55-17-6.61-1.49-2.19-3.43-2.77-5.93-2.92-8.5-.5-16.65-1.94-21.68-10a3.32,3.32,0,0,0-3.44-1.57C4.13,81.9-4.08,63.33,2,46.48c5.76-16.06,17.56-25.9,33.32-31.35a22.37,22.37,0,0,0,7.64-4.38C52.22,2.72,63.58.54,75.41.05ZM89,11.8c-4.32-.46-7.44-1.09-10.56-1.08-8.84,0-17.6.36-25.56,5.19C42.76,22,41,36,49.84,43.45c2.6,2.19,3,4,1.37,6.76-1.9,3.2-4.36,1.9-6.44.64-2.71-1.64-4.93-2.57-7.22.59-1.28,1.77-3.08,1.63-4.89.54s-1.86-2.68-1.25-4.36c4-10.92,3.45-16.2.82-18.81-2-1.95-9,4.45-11.82,7.1-7.5,7-11.14,14.35-9.35,25,1.42,8.46,8.84,10.74,15.63,5.63,2.43-1.83,4.79-5.57,8.56-3.24,4,2.45.73,5.81,0,8.52-1.26,4.83,1.25,6.85,5,8.21,5.54,2,8,0,10.39-5.36,3.9-8.52,10.1-8.18,13.67-20.58.76-2.61,1.7-5.45,5.28-4.72s2.9,3.79,2.57,6.11c-.55,3.79,1.11,4.57,4.44,4.48,5.77-.16,11.56.2,17.33,0,4.3-.18,5.51,7.37.31,8.31a45.82,45.82,0,0,1-12.92.49A23.42,23.42,0,0,0,64,73.54c-4.2,3.3-5.23,7.23-3.16,11.39C63.07,89.42,65.9,90.54,71.7,89c12.18-3.24,24-8.12,37.06-7.12,2.46.19,2.61-1.11,2.14-3.17a24.38,24.38,0,0,1,1.88-16.54c1.33-2.78,3-3.6,5.94-2.56s4,2.62,3,5.65a16.52,16.52,0,0,0,.44,12.21c2.53,5.44,7,8.25,13,8.67,5.33.38,9.52-1.38,12-6.27,2.72-5.35,1.41-7.41-4.43-7.77-2.69-.16-6.07.07-6.6-3.8s1.3-6.05,5.43-6.71,6.3-3.59,6.28-7.81c0-7.42-5.33-12.91-12.76-13.45-8.59-.62-15.62,2.61-21.39,8.77-2.08,2.22-4.14,2.61-6.56.83s-1.47-4-.17-5.71c2.59-3.36.06-9.87-2-14.09-1-2.16-.89-4.82,2-5.88s4.6.22,5.87,3c1.5,3.24,4,5.38,8,4.64s8.05-1.66,12.66-2.62c-6.46-9-14.81-13.4-25.61-12.91C92.93,17,85.7,27.46,90.37,41.53c1.18,3.54-.39,5.39-2.25,6.74-2,1.46-5.21-.72-8.45-8-1.2-2.71-2.56-3.42-6-3.65C62.73,35.87,59.12,32,59.5,29.35c.26-1.88,3.24-4.51,5.11-3.8,2.59,1,12.36,2.07,15.15-2A79.65,79.65,0,0,1,89,11.8Z" />
      </svg>
      <span className=" italic text-slate-700 drop-shadow group-hover:text-red-500">
        les masterminds
      </span>
    </Link>
  );
}

export function SideBar() {
  return (
    <div className="absolute flex min-h-screen w-64 flex-col justify-between bg-slate-200 pb-5 shadow-lg">
      <StatusPill />

      <nav className="flex flex-col pt-5 capitalize sm:justify-center">
        {[
          ["Home", "/"],
          ["login", "/login"],
          ["profile", "/profile"],
          ["fetch-user", "/fetch-user"],
          ["tic tac toe", "/ttt"],
          ["app", "/app"],
          ["contact", "/contact"],
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
      <TheMasterminds />
    </div>
  );
}

export function StatusPill() {
  const [currentUser, setCurrentUser] = useState<UserData>();
  useEffect(() => {
    let ignore = false;
    api<UserData>("http://localhost:3000/user/default42").then((result) => {
      if (!ignore) {
        setCurrentUser(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);

  const promise = api<UserData>("http://localhost:3000/user/default42");
  promise.then((value) => {
    if (!value) setCurrentUser(value); // this if (!value) stops react for spamming the get request, go figure
  });

  return (
    <>
      <div className="flex bg-white shadow-md ">
        <Avatar
          size="m-2 mb-3 mt-3 w-16 h-16"
          alt={currentUser?.name}
          status={currentUser?.status}
          img={currentUser?.avatar}
        />

        <div className="flex flex-col content-center justify-center ">
          <p className="font-semibold text-slate-700">
            {currentUser?.name}
          </p>
          <p className="text-slate-400">{"@" + currentUser?.login42}</p>
        </div>
      </div>
    </>
  );
}
