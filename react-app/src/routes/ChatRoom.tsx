import ChatMessages from "../components/ChatMassages";
import ChatRoomMenu from "../components/ChatRoomMenu";

export default function ChatRoom() {
  return (
    <div className="flex bg-green-400 flex-col max-h-full w-full h-full">
      <ChatRoomMenu/>
      <ChatMessages/>
    </div>
  );
}

