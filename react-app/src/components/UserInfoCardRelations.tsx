import {
  useMutDeleteUserFriendRequest,
  useMutPostUserFriendRequest,
  useMutPutUserFriendRequest,
} from "../functions/customHook";
import { IconAddUser, IconSent, IconUser } from "./Icons";

export type relationStatus =
  | "none"
  | "friends"
  | "sent"
  | "pending"
  | "blocked"
  | "loading"
  | "error";

export default function RelationActions({
  status,
  currentUser,
  cardUser,
}: {
  status: relationStatus;
  currentUser: string;
  cardUser: string;
}) {
  return (
    <div className="felx-col group relative flex w-12 flex-1 items-center justify-end">
      <div className="absolute h-full grow p-1 pr-2 text-slate-300 duration-300">
        {status === "friends" ? (
          <IconUser className="h-5 w-5 align-middle text-rose-400" />
        ) : status === "pending" ? (
          <div className="relative flex h-5 w-5">
            <IconAddUser className="h-5 w-5 align-middle text-rose-200" />
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-40 "></span>
          </div>
        ) : status === "sent" ? (
          // <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-b-transparent"></div>
          <IconSent />
        ) : (
          <IconAddUser />
        )}
      </div>
      <div className="duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl border border-slate-100 bg-white transition-all group-hover:w-max group-hover:p-2">
        <div className="text-xs font-semibold text-slate-500">
          <ActionsBTN
            currentUser={currentUser}
            cardUser={cardUser}
            status={status}
          />
        </div>
      </div>
    </div>
  );
}

export function ActionsBTN({
  status,
  currentUser,
  cardUser,
}: {
  status: relationStatus;
  currentUser: string;
  cardUser: string;
}) {
  const postFriendRequest = useMutPostUserFriendRequest();
  const putAcceptFriendRequest = useMutPutUserFriendRequest();
  const deleteRelation = useMutDeleteUserFriendRequest();

  const requestProps = {
    current_user: currentUser,
    target_user: cardUser,
  };

  function addFriend() {
    postFriendRequest.mutate(requestProps);
    console.log("Add friend");
  }
  function unFriend() {
    deleteRelation.mutate(requestProps);
    console.log("Unfriend");
  }
  function cancelRequest() {
    deleteRelation.mutate(requestProps);
    console.log("Cancled sent requests");
  }
  function accept() {
    putAcceptFriendRequest.mutate(requestProps);
    console.log("Accpeted request");
  }
  function reject() {
    deleteRelation.mutate(requestProps);
    console.log("Rejected request");
  }

  switch (status) {
    case "none":
      return <FB1 message="Friend request" a1="send" a1btn={addFriend} />;
    case "friends":
      return <FB1 message="Already friends" a1="remove" a1btn={unFriend} />;
    case "sent":
      return (
        <FB1
          message="Waiting for response ..."
          a1="Cancel"
          a1btn={cancelRequest}
        />
      );
    case "pending":
      return (
        <FB2
          message={"friend request"}
          a1={"accept"}
          a2={"reject"}
          a1btn={accept}
          a2btn={reject}
        />
      );
    case "blocked":
      return <FB message="You have been blocked!" />;
    case "loading":
      return <FB message="Loading ..." />;
    case "error":
      return <FB message="Error" />;
    default:
      return <FB message="" />;
  }
}

export function FB1({
  message,
  a1,
  a1btn,
}: {
  message: string;
  a1: string;
  a1btn: () => void;
}) {
  return (
    <div className="flex gap-2">
      <div className="border-r border-slate-400 pr-2 text-slate-400">
        {message}
      </div>
      <button className="hover:gradient-hightlight" onClick={a1btn}>
        {a1}
      </button>
    </div>
  );
}

export function FB2({
  message,
  a1,
  a2,
  a1btn,
  a2btn,
}: {
  message: string;
  a1: string;
  a2: string;
  a1btn: () => void;
  a2btn: () => void;
}) {
  return (
    <div className="flex gap-2">
      <div className="border-r border-slate-400 pr-2 text-slate-400">
        {message}
      </div>
      <button className="hover:gradient-hightlight" onClick={a1btn}>
        {a1}
      </button>
      <button className="hover:gradient-hightlight" onClick={a2btn}>
        {a2}
      </button>
    </div>
  );
}

function FB({ message }: { message: string }) {
  return (
    <div className="flex gap-2">
      <div className="border-r pr-2 text-slate-400">{message}</div>
    </div>
  );
}
