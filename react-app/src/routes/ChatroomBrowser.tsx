import { ErrorMessage } from "../components/ErrorComponents";
import {
  IconAdd,
  IconAddPulse,
  IconBashShell,
  IconPlusCircle,
  IconSearch,
} from "../components/Icons";
import { LoadingSpinnerMessage } from "../components/Loading";
import { useChatroomList } from "../functions/customHook";
import { IChatroom } from "../interfaces";
import { Form, Link } from "react-router-dom";
import { useState } from "react";
import BoxMenu, { ButtonGeneric } from "../components/BoxMenu";

export default function ChatroomBrowser() {
  const [buttonState, setButtonState] = useState<string>("UNSET");

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu heading={<ChatroomBroserHeading />}>
        <ButtonGeneric
          icon={IconAdd}
          setBTNstate={setButtonState}
          buttonState={buttonState}
          checked={"NEW_CHAT"}
        >
          <CreatChatroomUI />
        </ButtonGeneric>
      </BoxMenu>
      <div>
        <div className="h-56" />
        <Listing />
      </div>
    </div>
  );
}

function CreatChatroomUI() {
  const [chName, setChName] = useState("");
  const [password, setpassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 text-slate-600 shadow-xl">
      <h2 className="p-3 text-lg text-slate-500">
        Create a space to discuss pong, spin tactics and smurfing
      </h2>
      <Form className="flex h-full w-[32rem] flex-col gap-6 pb-4">
        <div>
          <label htmlFor="channel-name-input">
            <em className="font-semibold text-rose-600">* </em>
            Channel name
          </label>
          <div className="rounded-xl border border-slate-300 p-2 focus-within:border-rose-500 ">
            <input
              id="channel-name-input"
              className="focus: w-full outline-none focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-200"
              type="text"
              autoComplete="off"
              placeholder="Channel Name"
              
              onChange={(e) => setChName(e.currentTarget.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex ">
            <div className="relative flex w-32 flex-wrap items-center">
              <input
                className="peer relative h-10 w-5 cursor-pointer appearance-none rounded-full bg-stone-200 transition-colors after:absolute after:left-0 after:top-0 after:h-5 after:w-5 after:rounded-full after:bg-stone-400 after:transition-all checked:bg-rose-200 checked:after:top-5 checked:after:bg-rose-500 hover:bg-stone-300 after:hover:bg-stone-400 checked:hover:bg-rose-300 checked:after:hover:bg-rose-500 focus:outline-none focus-visible:outline-none"
                type="checkbox"
                defaultChecked={isPrivate}
                onClick={() => setIsPrivate(isPrivate ? false : true)}
                id="id-c01"
              />
              <label
                className="w-20 cursor-pointer pl-2 font-semibold peer-disabled:cursor-not-allowed peer-disabled:text-slate-300"
                htmlFor="id-c01"
              >
                {isPrivate ? "Private" : "Public"}
              </label>
            </div>
            <div className="grow">
              <label htmlFor="channel-password-input">Optional password</label>
              <div className="rounded-xl border border-slate-300 p-2 focus-within:border-rose-500 ">
                <input
                  id="channel-password-input"
                  className="focus: w-full outline-none focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-200"
                  type="password"
                  placeholder="Optional password"
                  disabled={isPrivate}
                  onChange={(e) => setpassword(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex ">
          <p className="grow">
            {chName === ""
              ? "Set a channel name "
              : "Create a " +
                  isPrivate
                    ? "private chatroom called " +
                      chName +
                      ", visible to only those you invite, and no password can be set"
                    : "public chatroom called " +
                      chName +
                      ", visible to everyone on the site and with " +
                      (password == ""
                        ? "no password set"
                        : password + " set as a password")
                + "."}
          </p>
          <button
            onClick={() => console.log("Asd")}
            className="flex w-min items-center justify-center rounded-xl border-b-2 border-stone-300 bg-stone-200 px-5 py-2 font-semibold text-slate-500 transition-all duration-100 hover:border-b-4 hover:border-rose-400 hover:text-rose-500"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}

function Listing() {
  const { data: chatrooms, isLoading, isError } = useChatroomList();
  const [searchValue, setSearchvalue] = useState("");

  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chatrooms ..." />;
  if (isError) return <ErrorMessage message="error loading chatroom" />;

  return (
    <ul className="flex flex-col justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
      <h1 className="px-2 font-semibold">Public Chatrooms</h1>
      <div className="flex justify-center  ">
        <div className="max-w-md grow ">
          <ChatroomSearch setSearchValue={(v: string) => setSearchvalue(v)} />
        </div>
      </div>
      {chatrooms.map((r) =>
        r.ownerLogin42.toLowerCase().startsWith(searchValue.toLowerCase()) ? ( //Ajouter la comparaison avec le nom du User
          <ChatroomCard key={r.ownerLogin42} chatroom={r} />
        ) : (
          <></>
        ),
      )}
    </ul>
  );
}

function ChatroomBroserHeading() {
  return (
    <div>
      <h1 className=" text-center text-2xl font-semibold text-slate-500 ">
        Public, Private & Secret <br />{" "}
        <b className="bg-gradient-to-br from-fuchsia-600 to-orange-500 bg-clip-text text-5xl text-transparent">
          Chatrooms
        </b>
      </h1>
    </div>
  );
}

function ChatroomSearch({
  setSearchValue,
}: {
  setSearchValue: (v: string) => void;
}) {
  return (
    <>
      <div className="rounded-xl border border-slate-300 p-2 focus-within:border-rose-500 ">
        <Form className="flex h-full w-full pl-3 ">
          <input
            className="focus: w-full outline-none  focus:border-none focus:ring-0"
            type="search"
            placeholder="search public channels"
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
          <div className="border-l border-slate-300">
            <button className="flex h-full w-10 items-center justify-center  text-slate-300">
              <IconSearch />
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}

function ChatroomCard({ chatroom }: { chatroom: IChatroom }) {
  return (
    <>
      <li className="flex items-center gap-2 px-2 py-1">
        {/* <img
          className={"h-5 w-5 rounded-full ring-2" + " "}
          src={chatroom.avatar}
          alt={chatroom.login42 || "undefined" + " profile image"}
        /> */}
        {/* <Link to={}/> */}
        <IconBashShell />
        <div className="grow ">{chatroom.name}</div>
        {/* <AdminButton userRole="ADMIN" cardRole={role} /> */}
      </li>
    </>
  );
}

// rabio
{
  /* <input checked className="relative w-8 h-4 transition-colors rounded-lg appearance-none cursor-pointer hover:bg-slate-400 after:hover:bg-slate-600 checked:hover:bg-rose-300 checked:after:hover:bg-rose-600 focus:outline-none checked:focus:bg-rose-400 checked:after:focus:bg-rose-700 focus-visible:outline-none peer bg-slate-300 after:absolute after:top-0 after:left-0 after:h-4 after:w-4 after:rounded-full after:bg-slate-500 after:transition-all checked:bg-rose-200 checked:after:left-4 checked:after:bg-rose-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:after:bg-slate-300" type="checkbox" value="" id="id-30a" /> */
}
