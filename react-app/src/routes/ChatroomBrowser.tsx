import { ErrorMessage } from "../components/ErrorComponents";
import {
  IconAdd,
  IconBashShell,
  IconCrown,
  IconSearch,
} from "../components/Icons";
import { LoadingSpinnerMessage } from "../components/Loading";
import { useChatroomList, useCurrentUser } from "../functions/customHook";
import { IChatroom } from "../interfaces";
import { Form, Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import BoxMenu, { ButtonGeneric } from "../components/BoxMenu";
import { UserIcon } from "../components/UserIcon";
import axios, { HttpStatusCode } from "axios";
import { authApi } from "../Api-axios";

export default function ChatroomBrowser() {
  const [buttonState, setButtonState] = useState<string>("UNSET");

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu
        heading={<ChatroomBroserHeading />}
        resetBTN={() => setButtonState("UNSET")}
      >
        <ButtonGeneric
          icon={IconAdd}
          setBTNstate={setButtonState}
          buttonState={buttonState}
          checked={"NEW_CHAT"}
        >
          <CreateChatroomUI />
        </ButtonGeneric>
      </BoxMenu>
      <div>
        <div className="h-56" />
        <Listing />
      </div>
    </div>
  );
}

function CreateChatroomUI() {
  const [chName, setChName] = useState("");
  const [password, setpassword] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const {data: currentUser} = useCurrentUser();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const name = chName;
    e.preventDefault();
    if (isPrivate || password == "") {
      const result = await authApi.post<HttpStatusCode>("/chatroom", {ownerLogin42: currentUser, name:  name, status: isPrivate ? "PRIVATE" : "PUBLIC"}).then();
    } else {
      const result = await authApi.post<HttpStatusCode>("/chatroom", {ownerLogin42: currentUser, name:  name, status: "PROTECTED", password: password}).then(); // TODO fusionner avec celui du dessus quand l'api le permet (mot de passe vide pour private et public)
    }
    navigate("/chatroom/" + name); // TODO changer name par id quand return par l'api
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 text-slate-600 shadow-xl">
      <h2 className="p-3 text-lg text-slate-500">
        Create a space to discuss pong, spin tactics and smurfing
      </h2>
      <form className="flex h-full w-[32rem] flex-col gap-6 pb-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="channel-name-input">
            <em className="font-semibold text-rose-600">* </em>
            Channel name
          </label>
          <div className="rounded-xl border border-slate-300 p-2 focus-within:border-rose-500 ">
            <input
              id="channel-name-input"
              className="w-full outline-none placeholder:text-slate-300 focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-200"
              type="text"
              autoComplete="off"
              placeholder="Noobish Helpdesk"
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
              <label
                htmlFor="channel-password-input"
                className={`${isPrivate ? "text-slate-300" : ""}`}
              >
                Password, optional
              </label>
              <div
                className={`rounded-xl border p-2 focus-within:border-rose-500 ${
                  isPrivate ? "border-slate-200" : "border-slate-300"
                } `}
              >
                <input
                  id="channel-password-input"
                  className={`w-full outline-none focus:border-none focus:ring-0 disabled:cursor-not-allowed disabled:text-slate-200  ${
                    isPrivate
                      ? "placeholder:text-slate-100"
                      : "placeholder:text-slate-300"
                  }`}
                  type="password"
                  placeholder="secure password"
                  disabled={isPrivate}
                  onChange={(e) => setpassword(e.currentTarget.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <ChatroomCreationDescription
            isPrivate={isPrivate}
            password={password}
            chName={chName}
          />
          <button
            type="submit"
            className="flex h-12 w-min items-center justify-center rounded-xl border-b-2 border-stone-300 bg-stone-200 px-5 py-2 font-semibold text-slate-500 transition-all duration-100 hover:border-b-4 hover:border-rose-400 hover:text-rose-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

function Listing() {
  const { data: chatrooms, isLoading, isError } = useChatroomList();
  if (isLoading)
    return <LoadingSpinnerMessage message="Loading chatrooms ..." />;
  if (isError) return <ErrorMessage message="error loading chatroom" />;

  return <ListingFiltered chatrooms={chatrooms} />;
}

function ListingFiltered({ chatrooms }: { chatrooms: IChatroom[] }) {
  const [searchValue, setSearchvalue] = useState("");

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
          <ChatroomCard key={r.id} chatroom={r} />
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
      <nav className="cursor-pointer  border-l-rose-600 px-4 py-2 text-sm font-medium text-slate-600 outline-none transition-all duration-100 ease-in-out hover:border-l-4 hover:border-l-rose-600 hover:text-rose-600 focus:border-l-4">
        <Link
          to={"/chatroom/" + chatroom.id}
          className="flex flex-grow items-center gap-2"
        >
          <IconBashShell />
          <span className="grow"> {chatroom.name}</span>
          <IconCrown className="h-5 w-5 align-middle text-amber-400" />
          <UserIcon user={chatroom.ownerLogin42} />
        </Link>
      </nav>
    </>
  );
}

function ChatroomCreationDescription({
  isPrivate,
  password,
  chName,
}: {
  isPrivate: boolean;
  password: string;
  chName: string;
}) {
  if (chName === "") return <p className="grow">Set a channel name.</p>;
  if (isPrivate)
    return (
      <p className="grow">
        Create a <b>private</b> channel called{" "}
        <b className="gradient-hightlight">{chName}</b>, visible to only those
        you invite, and no password can be set.
      </p>
    );
  if (password === "")
    return (
      <p className="grow">
        Create a <b>public</b> channel called{" "}
        <b className="gradient-hightlight">{chName}</b>, visible to everyone on
        the site and with <b>no password</b> set.
      </p>
    );
  return (
    <p className="grow">
      Create a <b>public</b> channel called{" "}
      <b className="gradient-hightlight">{chName}</b>, visible to everyone on
      the site and with "<b>{password}</b>" set as the password.
    </p>
  );
}
