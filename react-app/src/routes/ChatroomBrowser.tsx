import { Link } from "react-router-dom";
import { ErrorMessage } from "../components/ErrorComponents";
import { IconCrown, IconDownChevron } from "../components/Icons";
import { LoadingSpinnerMessage } from "../components/Loading";
import { UserIcon } from "../components/UserIcon";
import { useChatroomList } from "../functions/customHook";
import { IChatroom } from "../interfaces";

export default function ChatroomBrowser() {
  const { data: chatrooms, isLoading, isError } = useChatroomList();

  if (isLoading)
    return <LoadingSpinnerMessage message="loading chatroom data ..." />;
  if (isError) return <ErrorMessage message="error loading chatroom data :(" />;

  return (
    <>
      <button onClick={() => console.log("Clicked button")}>
        <div className="rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 p-8 shadow ">
          <h1 className="text-2xl font-bold text-stone-50">
            Create a new chat Room
          </h1>
        </div>
      </button>

      {/* <NavExpandable name={"foo"} icon={IconCrown}> */}
      {/* <ul className="flex flex-col gap-4"> */}
      <Listing
        id="public-chatrooms"
        title={<h1 className="p-4 text-2xl font-semibold flex-grow">Public chatrooms</h1>}
      >
        {chatrooms.map((r) => (
          <RoomCard room={r} />
        ))}
      </Listing>
      {/* </ul> */}
      {/* </NavExpandable> */}
    </>
  );
}

function RoomCard({ room }: { room: IChatroom }) {
  return (
    <>
      <nav className="hover:gradient-hightlight flex w-96 items-center gap-2 rounded-xl border-b-2 border-stone-300 bg-stone-100 p-5 py-3 text-lg font-semibold hover:border-rose-400">
        <Link to={"/chatroom/" + room.id} className="flex-grow">
          {room.name}
        </Link>
        <IconCrown className="h-5 w-5 align-middle text-amber-400" />
        <Link to={"/user/" + room.ownerLogin42}>
          <UserIcon user={room.ownerLogin42} />
        </Link>
      </nav>
    </>
  );
}

export function Listing({
  id,
  title,
  children,
}: {
  id: string;
  title: JSX.Element;
  children?: JSX.Element[] | JSX.Element;
}) {
  return (
    <div className="bg-stone-50 p-4 box-theme">
      <input
        defaultChecked={false}
        type="checkbox"
        name="otption"
        id={id}
        className="peer hidden"
      />
      <label
        htmlFor={id}
        className="peer-checked:gradient-hightlight relative flex cursor-pointer items-center transition"
      >
        {/* <div className="flex items-center"> */}
        {title} <IconDownChevron className="h-6 w-6 rotate-90" />
        {/* </div> */}
      </label>
      <ul className="max-h-0 flex flex-col gap-4 overflow-y-auto transition-all duration-500 peer-checked:max-h-96">
        {children}
      </ul>
    </div>
  );
}

export function NavExpandable({
  name,
  icon: Icon,
  children,
}: {
  name: string;
  icon: ({
    className,
    strokeSize,
  }: {
    className?: string;
    strokeSize?: number;
  }) => JSX.Element;
  children?: JSX.Element[];
}) {
  return (
    <div className="relative h-20 transition">
      <input
        className="peer hidden"
        type="checkbox"
        id={`menu-${name}`}
        defaultChecked={false}
      />
      <label
        htmlFor={`menu-${name}`}
        className="relative flex h-full w-full cursor-pointer items-center  text-sm font-medium text-slate-600 outline-none transition-all duration-100 ease-in-out hover:text-rose-600"
      >
        <div className="item-center flex  px-4 py-2 text-sm font-medium text-slate-600 outline-none transition-all duration-100 ease-in-out hover:text-rose-600">
          {Icon && <Icon />}
          <p className="pl-4">{name}</p>
        </div>
      </label>
      <IconDownChevron className="pointer-events-none absolute right-0 top-6 h-6 -rotate-90 px-5 text-slate-600 transition peer-checked:rotate-90 peer-hover:text-rose-600" />
      <ul className="duration-400 flex max-h-0 flex-col overflow-y-auto rounded transition-all duration-300 peer-checked:max-h-96">
        {children}
      </ul>
    </div>
  );
}
