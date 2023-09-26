import ChatMessages from "../components/ChatMassages";
import ChatRoomMenu from "../components/ChatRoomMenu";

export default function ChatRoom() {
  return (
    <div className="h-full">
      <ChatRoomMenu/>
      <ChatMessages/>
    </div>
  );
}

