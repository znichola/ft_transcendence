import { useState } from "react";
import { api } from "./utils.tsx";

export default function ProfileCard() {
  interface MyData {
    id: number;
    user: string;
    friends: number;
    img_url: string;
    rank: number;
  }

  const [userProfile, setUserProfile] = useState<MyData>();

  const promise = api<MyData>("http://localhost:3000/user/defaultus");
  promise.then((value) => {
    setUserProfile(value);
  });

  const number_of_victories = 1;
  return (
    <div className=" flex gap-2 bg-lime-300 p-5  rounded-3xl  text-lime-800 shadow-lg">
      <img
        className=" rounded-full object-scale-down h-24 shadow"
        src={userProfile?.img_url || "https://i.imgflip.com/2/aeztm.jpg"}
        alt="User-Profile-Image"
      />
      <div className="flex flex-col">
        <div className=" text-lime-950 font-bold ">
          {userProfile?.user || "No username"}{" "}
        </div>
        <div>
          {(userProfile?.friends || "None") + " friends"}
        </div>
        <div>numeber of victories: {number_of_victories} </div>
        <div>rank: {userProfile?.rank ? userProfile.rank : "Norank"} </div>
      </div>
    </div>
  );
}
