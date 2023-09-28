import ChatMessages from "../components/ChatMassages";

export default function ChatRoom() {
  return (
    <div className="relative flex flex-col w-full h-full">
      <ChatMessages/>
      <div className="absolute w-full h-[7%] bg-gradient-to-t from-stone-50 to-transparent left-0 bottom-0"></div>
    </div>
  );
}

