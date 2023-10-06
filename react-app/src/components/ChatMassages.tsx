import { UserData } from "../interfaces";
import { useEffect, useMemo, useRef, useState } from "react";
import ChatRoomMenu from "./ChatRoomMenu.tsx";

function statusColor(status: UserData["status"]) {
  switch (status) {
    case "ONLINE":
      return "border-green-600";
    case "OFFLINE":
      return "border-gray-300";
    case "INGAME":
      return "border-blue-400";
    case "UNAVAILABLE":
      return "border-red-500";
    default:
      return "border-ping-700";
  }
}

export function Message({
  sender,
  text,
  left,
}: {
  sender: UserData;
  text: string;
  left: boolean;
}) {
  return (
      <div
        className={`flex items-center w-fit h-fit rounded-3xl gap-2 ${
          left ? "text-left" : "flex-row-reverse mr-0 ml-auto"
        } max-w-prose`}
      >
        <img
          className={
            `peer h-14 w-14 rounded-full border-b-2 object-cover border-separate self-start m-[1px]` +
            " " +
            statusColor(sender.status)
          }
          src={sender.avatar}
          alt={sender.login42 || "undefined" + " profile image"}
        />
        <div className="absolute">

        </div>
        <p className="min-w-0 break-words bg-white border-b-2 py-2 rounded-3xl px-4">
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
    this.status = "ONLINE";
    this.wins = 0;
    this.losses = 0;
    this.avatar = "https://i.imgflip.com/2/aeztm.jpg";
    this.bio = "My bio";
  }
}

function NewMessageArea({messages, setMessages}) {

  const [inputValue, setInputValue] = useState("");

  function handleChange(event) {
    setInputValue(event.currentTarget.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMessages([...messages, inputValue]); // Temporaire, uniquement pour les test
    setInputValue("");
  }

  function handlerOnEnter(event) {
    if (event.keyCode == 13 && event.shiftKey == false) {
      handleSubmit(event);
    }
  }

  return (
      <form
        className="absolute flex justify-center w-full bottom-20 top-auto px-20"
        onSubmit={handleSubmit}
        onKeyDown={handlerOnEnter}
      >
        <textarea
          className={`w-full rounded-full h-32 z-10 shadow-lg border-b-4 px-6 outline-none ${
            inputValue.length < 85 ? "pt-2" : "pt-3"
          } resize-none transition-all duration-700`}
          style={{
            maxWidth: inputValue.length < 50 ? "25rem" : "40rem",
            maxHeight: inputValue.length < 80 ? "2.5rem" : "5rem",
          }}
          placeholder="Enter a message..."
          value={inputValue}
          onChange={handleChange}
        />
      </form>
  );
}

// Image en dehors des messages et glisses quand overflow

export default function ChatMessages() {

  const [messages, setMessages] = useState(["Lundi", "Mardi", "Mercredi"]);

  return (
    <div className="relative flex h-full min-h-0 w-full max-h-full items-center flex-grow-0 flex-col">
      <ChatRoomMenu />
      <div className="flex h-full w-full min-h-0 pt-56 pb-52 flex-col gap-1 overflow-auto bg-stone-100 p-3 px-10">
        {messages.map((element, index) => {
          return (
            <Message
              sender={new FakeUser()}
              text={element}
              left={index % 2 == 0}
              key={index}
            />
          );
        })}
      </div>
      <NewMessageArea messages={messages} setMessages={setMessages}/>
    </div>
  );
}
