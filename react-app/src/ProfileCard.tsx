import { useState } from "react";
import { api } from "./utils.tsx";
import { UserData } from "./interfaces.tsx";

export default function ProfileCard() {
  const [userProfile, setUserProfile] = useState<UserData>();

  const promise = api<UserData>("http://localhost:3000/user/0");
  promise.then((value) => {
    setUserProfile(value);
  });

  return (
    <div className=" flex gap-2 bg-lime-300 p-5  rounded-3xl  text-lime-800 shadow-lg">
      <img
        className=" rounded-full object-scale-down h-24 shadow"
        src={userProfile?.avatar || "https://i.imgflip.com/2/aeztm.jpg"}
        alt="User-Profile-Image"
      />
      <div className="flex flex-col">
        <div className=" text-lime-950 font-bold ">
          {userProfile?.username || "No username"}{" "}
        </div>
        <div>
          {(userProfile?.friend_ids ? userProfile?.friend_ids.length : "None") +
            " friends"}
        </div>
        <div>numeber of victories: {userProfile?.wins || "None"} </div>
        <div>rank: {userProfile?.rank ? userProfile.rank : "Norank"} </div>
      </div>
    </div>
  );
}
