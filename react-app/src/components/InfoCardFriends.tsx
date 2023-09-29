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

type relationActions = {
  [key in relationStatus]: string | action;
};

const friendStatusMessage: friendStatusMessage = {
  none: "Add them as friend",
  friends: "You are already friends",
  sent: "You have sent a friend request",
  pending: "friend request",
  blocked: "This person has blocked you",
  loading: "Loading ...",
  error: "Error ...",
};

const friendActions: relationActions = {
  none: "Add friend",
  friends: "Remove friend",
  sent: "Cancel friend request",
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
    <div className="felx-col group relative flex w-12 flex-1 items-center justify-end">
      <div className="absolute h-full grow p-1 pr-2 text-slate-300 duration-300">
        {status == "friends" ? (
          <IconUser className="h-5 w-5 align-middle text-rose-400" />
        ) : (
          <IconAddUser />
        )}
      </div>
      <div className="duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl border border-slate-100 bg-white transition-all group-hover:w-max group-hover:p-2">
        <div className="text-xs font-semibold text-slate-500">
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
    console.log("Unfriend");
  }
  function cancelRequest() {
    console.log("Cancled sent requests");
  }
  function accept() {
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
      return <FB status={status} btnClick={cancelRequest} />;
    case "pending":
      return (
        <div className="flex gap-2">
          <div className="border-r border-slate-400 pr-2 text-slate-400">
            {friendStatusMessage[status]}
          </div>
          <button className="hover:gradient-hightlight" onClick={accept}>
            {(friendActions[status] as action).accept}
          </button>
          <button className="hover:gradient-hightlight" onClick={reject}>
            {(friendActions[status] as action).reject}
          </button>
        </div>
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
  if (status == "pending") return <></>;
  return (
    <button className="hover:gradient-hightlight" onClick={btnClick}>
      {friendActions[status] as string}
    </button>
  );
}

// <div className="felx-col group relative flex w-12 flex-1 items-center justify-end ">
//       <div className="absolute h-full grow p-1 pr-2 text-slate-300 duration-300">
//         {status == "friends" ? (
//           <IconUser className="h-5 w-5 align-middle text-rose-400" />
//         ) : (
//           <IconAddUser />
//         )}
//       </div>
//       <div className="duration-400 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-gradient-to-tl from-fuchsia-600 to-orange-500 shadow-md transition-all group-hover:w-max group-hover:p-2">
//         <div className="text-xs font-bold text-slate-50"></div>
//       </div>
//     </div>

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
