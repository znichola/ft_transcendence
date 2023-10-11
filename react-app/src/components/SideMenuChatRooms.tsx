import { Link } from "react-router-dom";
import { useChatroomList } from "../functions/customHook";
import { Chatroom, UserData } from "../interfaces";
import { ErrorMessage } from "./ErrorComponents";
import { IconCrown } from "./Icons";
import { LoadingSpinnerMessage } from "./Loading";
import { Nav } from "./SideMenu";
import { UserIcon } from "./UserIcon";

function SmallRoomCard({ room }: { room: Chatroom }) {
  return (
      <nav className="flex gap-2 cursor-pointer items-center border-l-rose-600 px-4 py-2 text-sm font-medium text-slate-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-rose-600 hover:text-rose-600 focus:border-l-4">
        <Link to={"/chatroom/" + room.id} className="flex-grow">
          {room.name}
        </Link>
        <IconCrown className="h-5 w-5 align-middle text-amber-400" />
        <Link to={"/user/" + room.ownerLogin42}>
          <UserIcon user={room.ownerLogin42} />
        </Link>
      </nav>
  );
}

export default function NavChatRooms() {
  const { data: chatrooms, isLoading, isError } = useChatroomList();

  if (isLoading)
    return <LoadingSpinnerMessage message="loading chatroom data ..." />;
  if (isError) return <ErrorMessage message="error loading chatroom data :(" />;
  return (
    <>
      {chatrooms.map((r) => (
          <SmallRoomCard room={r} />
        ))}
    </>
  );
}
