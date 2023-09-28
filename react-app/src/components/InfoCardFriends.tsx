import { IconAddUser, IconUser } from "./Icons";

export type relationStatus =
  | "none"
  | "friends"
  | "sent"
  | "pending"
  | "blocked"
  | "loading"
  | "error";

type friendStatusMessage = {
  [key in relationStatus]: string;
};

type action = { accept: string; reject: string };

type friActions = {
  [key in relationStatus]: string | action;
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

export default function RelationActions({
  status,
}: {
  status: relationStatus;
}) {
  return (
    <div className="felx-col group relative flex w-12 flex-1 items-center justify-end ">
      <div className="absolute h-full grow p-1 pr-2 text-slate-300 duration-300">
        {status == "friends" ? (
          <IconUser className="h-5 w-5 align-middle text-rose-400" />
        ) : (
          <IconAddUser />
        )}
      </div>
      <div className="duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-gradient-to-tl from-fuchsia-600 to-orange-500 shadow-md transition-all group-hover:w-max group-hover:p-2">
        <div className="text-xs font-bold text-slate-50">
          <ActionsBTN status={status} />
        </div>
      </div>
    </div>
  );
}

export function ActionsBTN({ status }: { status: relationStatus }) {
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
      return <FB status={status} btnClick={addFriend} />;
    case "friends":
      return <FB status={status} btnClick={unFriend} />;
    case "sent":
      return <FB status={status} btnClick={unFriend} />;
    case "pending":
      return (
        <>
          <FB status={status} btnClick={accpept} />
          <FB status={status} btnClick={reject} />
        </>
      );
    case "blocked":
      return <FB status={status} btnClick={block} />;
    case "loading":
      return <div>{friendStatusMessage[status]}</div>;
    case "error":
      return <div>{friendStatusMessage[status]}</div>;
    default:
      return <div>{friendStatusMessage[status]}</div>;
  }
}

function FB({
  status,
  btnClick,
}: {
  status: relationStatus;
  btnClick: () => void;
}) {
  return (
    <div className="felx-col group relative flex w-12 flex-1 items-center justify-end ">
      <div className="absolute h-full grow p-1 pr-2 text-slate-300 duration-300">
        {status == "friends" ? (
          <IconUser className="h-5 w-5 align-middle text-rose-400" />
        ) : (
          <IconAddUser />
        )}
      </div>
      <div className="duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-gradient-to-tl from-fuchsia-600 to-orange-500 shadow-md transition-all group-hover:w-max group-hover:p-2">
        <div className="text-xs font-bold text-slate-50"></div>
      </div>
    </div>
  );
}

//  <button
//    className="felx-col group relative flex w-12 flex-1 items-center justify-end"
//    onClick={btnClick}
//  >
//    {/* to test lated for removing this div */}
//    <div className="absolute h-full grow p-1 pr-2 text-slate-300">
//      {status == "friends" ? (
//        <IconUser
//          className="h-5 w-5 align-middle text-rose-400"
//          strokeWidth={2}
//        />
//      ) : (
//        <IconAddUser strokeWidth={2} />
//      )}
//    </div>
//    <div
//      className={`duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-gradient-to-tl  shadow-md transition-all group-hover:w-max group-hover:p-2 ${
//        status == "friends"
//          ? "from-amber-600 to-fuchsia-400"
//          : "from-fuchsia-600 to-orange-500"
//      } `}
//    >
//      <span className="text-xs font-bold text-slate-50">
//        {friendStatusMessage[status] as string}
//      </span>
//    </div>
//  </button>;
