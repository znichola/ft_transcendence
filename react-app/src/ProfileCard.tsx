import { useState, useEffect } from "react";
import { api } from "./utils.tsx";
import { UserData } from "./interfaces.tsx";

export default function ProfileCard() {
  const [userProfile, setUserProfile] = useState<UserData>();
  useEffect(() => {
    let ignore = false;
    api<UserData>("http://localhost:3000/user/0").then((result) => {
      if (!ignore) {
        setUserProfile(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, []);


  return (
    <div className=" flex gap-2 rounded-3xl bg-lime-300  p-5  text-lime-800 shadow-lg">
      <img
        className=" h-24 rounded-full object-scale-down shadow"
        src={userProfile?.avatar || "https://i.imgflip.com/2/aeztm.jpg"}
        alt="User-Profile-Image"
      />
      <div className="flex flex-col">
        <div className=" font-bold text-lime-950 ">
          {userProfile?.name || "No username"}{" "}
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
