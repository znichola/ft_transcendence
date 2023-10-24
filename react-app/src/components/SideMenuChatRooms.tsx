import { Link } from "react-router-dom";
import { useChatroomList } from "../api/apiHooks";
import { IChatroom } from "../interfaces";
import { ErrorMessage } from "./ErrorComponents";
import { IconBashShell } from "./Icons";
import { LoadingSpinnerMessage } from "./Loading";

function SmallRoomCard({ room }: { room: IChatroom }) {
  return (
    <nav>
      <Link
        to={"/chatroom/" + room.id}
        className=" flex flex-grow cursor-pointer items-center gap-2 border-l-rose-600 px-4 py-2 text-sm font-medium text-slate-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-rose-600 hover:text-rose-600 focus:border-l-4"
      >
        <IconBashShell />
        {room.name}
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
        <SmallRoomCard key={r.id} room={r} />
      ))}
    </>
  );
}
