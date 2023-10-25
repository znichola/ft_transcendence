import { IMessage, UserData } from "../interfaces";
import { UserIcon } from "./UserIcon.tsx";
import { timeAgo } from "../functions/utils.tsx";

export function Message({
  sender,
  message,
  left,
  showIcon,
}: {
  sender: UserData;
  message: IMessage;
  left: boolean;
  showIcon: boolean;
}) {
  return (
    <div
      className={`flex h-fit w-fit items-center gap-2 rounded-3xl ${
        left ? "text-left" : "ml-auto mr-0 flex-row-reverse"
      } max-w-prose ${showIcon ? "pb-6" : ""}`}
    >
      {showIcon ? (
        <UserIcon user={sender.login42} size={8} />
      ) : (
        <div className="h-8 w-8" />
      )}
      <div className="absolute"></div>
      <p
        className={`min-w-0 break-words rounded-t-xl border-b-2 bg-white px-4 py-2 ${
          left ? "rounded-r-xl" : "rounded-l-xl"
        }`}
      >
        {message.content}
      </p>
      <span className="text-sm font-light italic text-slate-500">
        {showIcon ? timeAgo(message.sentAt) : ""}
      </span>
    </div>
  );
}
