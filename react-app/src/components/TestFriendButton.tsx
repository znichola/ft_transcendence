import { IconAddUser } from "./Icons";

type friendStatus =
  | "none"
  | "friends"
  | "sent"
  | "pending"
  | "blocked"
  | "loading"
  | "error";

type friendStatusMessage = {
  [key in friendStatus]: string;
};

type action = { accept: string; reject: string };

type friActions = {
  [key in friendStatus]: string | action;
};

const friendStatusMessage: friendStatusMessage = {
  none: "Add them as freind",
  friends: "You are already friends",
  sent: "You have sent a friend request",
  pending: "Accept / reject their freind request",
  blocked: "This person has blocked you",
  loading: "Loading ...",
  error: "Error ...",
};

const friActions: friActions = {
  none: "Add freind",
  friends: "Un freind",
  sent: "You have sent a friend request",
  pending: { accept: "accept", reject: "reject" },
  blocked: "This person has blocked you",
  loading: "Loading ...",
  error: "Error ...",
};

export default function FriendActionsBTN({ status }: { status: friendStatus }) {
  function addFriend() {
    console.log("Add friend");
  }
  function unFriend() {
    console.log("Unfreind");
  }
  function accpept() {
    console.log("Accpeted request");
  }
  function reject() {
    console.log("Rejected request");
  }
  function block() {
    console.log("Bocked");
  }

  switch (status) {
    case "none":
      return <FB text={friActions[status] as string} onClick={addFriend}/>
    case "friends":
      return <FB text={friActions[status] as string} onClick={unFriend} />;
    case "sent":
      return <FB text={friActions[status] as string} onClick={unFriend} />;
    case "pending":
      return (
        <>
          <FB text={(friActions[status] as action).accept} onClick={accpept} />
          <FB text={(friActions[status] as action).reject} onClick={reject} />
        </>
      );
    case "blocked":
      return <FB state={status} onClick={block} />;
    case "loading":
      return <div>{friendStatusMessage[status]}</div>;
    case "error":
      return <div>{friendStatusMessage[status]}</div>;
    default:
      return <div>{friendStatusMessage[status]}</div>;
  }
}

function FB({state}: {state: string; onClick: () => void }) {
  return (
    <button
      className="felx-col group relative flex w-12 flex-1 items-center justify-end"
      onClick={onClick}
    >
      {/* to test lated for removing this div */}
      <div className="absolute h-full grow p-1 pr-2 text-slate-300">
        {<IconAddUser strokeWidth={2} />}
      </div>
      <div
        className={`duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-gradient-to-tl  shadow-md transition-all group-hover:w-max group-hover:p-2 ${
          isFriend
            ? "from-amber-600 to-fuchsia-400"
            : "from-fuchsia-600 to-orange-500"
        } `}
      ></div>
      {text}
    </button>
  );
}


<button
  className="felx-col group relative flex w-12 flex-1 items-center justify-end "
  onClick={handleFriendClick}
>
  <div className="absolute h-full grow p-1 pr-2 text-slate-300">
    {<IconAddUser strokeWidth={2} />}
  </div>
  <div
    className={`duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-gradient-to-tl  shadow-md transition-all group-hover:w-max group-hover:p-2 ${
      isFriend
        ? "from-amber-600 to-fuchsia-400"
        : "from-fuchsia-600 to-orange-500"
    } `}
  >
    <span className="text-xs font-bold text-slate-50">
      {isFriend
        ? "already freinds"
        : isPending
        ? "accept friend request"
        : isRequensted
        ? "already set freind request"
        : "add freind"}
    </span>
  </div>
</button>;