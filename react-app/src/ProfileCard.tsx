import { useState } from "react";
import { api } from "./utils.tsx";
import { UserData } from "./interfaces.tsx";

export default function ProfileCard() {
  const [userProfile, setUserProfile] = useState<UserData>();

  const promise = api<UserData>("http://localhost:3000/user/0");
  promise.then((value) => {
    if (!value) setUserProfile(value); // this if (!value) stops react for spamming the get request, go figure
  });

  return (
    <div className=" flex gap-2 rounded-3xl bg-lime-300  p-5  text-lime-800 shadow-lg">
      <img
        className=" h-24 rounded-full object-scale-down shadow"
        src={userProfile?.avatar || "https://i.imgflip.com/2/aeztm.jpg"}
        alt="User-Profile-Image"
      />
      <div className="flex flex-col">
        <div className=" font-bold text-lime-950 ">
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
