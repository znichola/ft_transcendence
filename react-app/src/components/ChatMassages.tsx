import { UserData } from "../interfaces";
import Avatar from "./Avatar";
import { Nav } from "./SideMenu.tsx";

// Temporaire pour le user
import { getCurrentUser } from "../Api-axios.tsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Component, useRef, useState } from "react";


const messages = ["Lundi", "Mardi", "Mercredi"];

function statusColor(status: UserData["status"]) {
  switch (status) {
    case "ONLINE":
      return "ring-green-600";
    case "OFFLINE":
      return "ring-gray-300";
    case "INGAME":
      return "ring-blue-400";
    case "UNAVAILABLE":
      return "ring-red-500";
    default:
      return "ring-ping-700";
  }
}

function Message({sender, text, left}:{sender: UserData, text: string, left: boolean}) {
  return (
    <div className={`flex gap-5 ${left ? "text-left" : "flex-row-reverse" } `}>
      <img
        className={
          "min-w-[5rem] w-20 h-20 rounded-full ring-2" + " " + statusColor(sender.status)
        }
        src={sender.avatar}
        alt={sender.login42 || "undefined" + " profile image"}
      />
      <p className="break-words shadow bg-white rounded-xl p-3 whitespace-pre-line pt-6 px-3 min-w-0">
        {text}
      </p>
    </div>
  );
}


export class FakeUser implements UserData {
  id: number;
  name: string;
  login42: string;
  elo: number;
  // rank: number;
  status?: string;
  wins: number;
  losses: number;
  // friend_ids: [number];
  // game_ids: [number];
  avatar: string;
  bio?: string;
  constructor() {
    this.id = 0;
    this.login42 = "default42";
    this.name = "Defaultus";
    this.elo = 1500;
    this.status = 'ONLINE';
    this.wins = 0;
    this.losses = 0;
    this.avatar = "https://i.imgflip.com/2/aeztm.jpg"
    this.bio = "My bio"
  }
}

// Image en dehors des messages et glisses quand overflow

export default function ChatMessages() {

  const [inputValue, setInputValue] = useState("");

  function handleChange(event) {
    setInputValue(event.currentTarget.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    messages.push(inputValue);
    setInputValue("");
  }

  function handlerOnEnter(event) {
    if(event.keyCode == 13 && event.shiftKey == false) {
      handleSubmit(event);
    }
  }

  return(
    <div className="flex flex-col flex-grow-0 w-full h-[85%] py-5">
      <div className="flex flex-col w-full h-full text-slate-800 overflow-auto p-3 px-10 gap-6 text lg:text-xl font-light bg-stone-100 ">
        {
          messages.map((element, index) => {
            return(<Message sender={new FakeUser} text={element} left={index%2==0} key={index}/>);
          })
        }
      </div>
      <div className="h-32 w-full px-20">
        <form className="flex justify-center h-full w-full" onSubmit={handleSubmit} onKeyDown={handlerOnEnter}>
          <textarea className={`rounded-full w-full px-5 ${inputValue.length < 85 ? "pt-2" : "pt-3"} transition-all duration-700 resize-none`}
          style={{maxWidth: inputValue.length < 50 ? "25rem" : "40rem", maxHeight: inputValue.length < 80 ? "2.5rem" : "5rem"}} placeholder="Enter a message..." value={inputValue} onChange={handleChange}/>
        </form>
      </div>
    </div>
  );
}