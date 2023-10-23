import { useContext, useEffect } from "react";
import { IconX } from "./Icons";
import { useNavigate } from "react-router-dom";
import { INotification, TNotif } from "../interfaces";
import { NotificationContext } from "../routes/NotificationProvider";
import { userSocket, pongSocket } from "../socket";

export default function NotificationWrapper({
  className: cn,
}: {
  className: string;
}) {
  const { notifications, removeNotif } = useContext(NotificationContext);

  return (
    <div
      className={`${cn} absolute z-40 flex w-96 flex-col gap-2 transition-all`}
    >
      {notifications.map((n, i) => (
        <Notification {...n} key={n.id} destroy={() => removeNotif(i)} />
      ))}
    </div>
  );
}

interface INotifArgs extends INotification {
  destroy: () => void;
}

function Notification({ message, to, from, type: t, destroy }: INotifArgs) {
  const navigate = useNavigate();
  return (
    <div
      className={
        classNameDiv(t) +
        " relative flex w-full items-center gap-4 rounded-lg border px-4 text-sm"
      }
      role="alert"
    >
      {to ? (
        <button
          onClick={() => {
            destroy();
            if (to) navigate(to);
          }}
          className="h-full w-full py-3 text-left"
        >
          <MsgText type={t} message={message} from={from} />
        </button>
      ) : (
        <div className="h-full w-full py-3">
          <MsgText type={t} message={message} from={from} />
        </div>
      )}

      <BTNx type={t} destroy={destroy} />
    </div>
  );
}

function MsgText({
  type,
  message,
  from,
}: {
  type: TNotif;
  message?: string;
  from?: string;
}) {
  return (
    <div className="flex-grow">
      <h3 className="pb-1 font-semibold capitalize">{type?.toLowerCase()}</h3>
      <p className="pl-3">
        {from && type == "MESSAGE" ? <b>{from}: </b> : ""}
        {type == "CLASSICAL" || type == "SPECIAL" ? (
          <span>
            Accept <b>{from}</b>'s challenge ?
          </span>
        ) : type == "RESUME" ? (
          <span>
            Resume match with <b>{from}</b>{" "}
          </span>
        ) : type == "FRIEND" ? (
          <span>
            <b>{from}</b> sent your a request
          </span>
        ) : (
          message
        )}
      </p>
    </div>
  );
}

function BTNx({ type: t, destroy }: { type: TNotif; destroy?: () => void }) {
  return (
    <button
      aria-label="Close"
      onClick={destroy}
      className={classNameBTBN(t) + " absolute right-1 top-1"}
    >
      <span className="only:-mx-4">
        <IconX className="h-4 w-4" />
      </span>
    </button>
  );
}

// DON'T try be smart and generate this friken wall of text by string replacing,
// randomly some classses will not be generated and not work, it's a while load of shit!
// so don't work on this bikeshed, I've already spent enough time to accomplish basically nothing

function classNameBTBN(type: TNotif) {
  switch (type) {
    case "ERROR":
      return "inline-flex h-8 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-4 text-xs font-medium tracking-wide text-rose-500 transition duration-300 hover:bg-rose-100 hover:text-rose-600 focus:bg-rose-200 focus:text-rose-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-rose-300 disabled:shadow-none disabled:hover:bg-transparent";
    case "CLASSICAL":
      return "inline-flex h-8 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-4 text-xs font-medium tracking-wide text-stone-500 transition duration-300 hover:bg-stone-100 hover:text-stone-600 focus:bg-stone-200 focus:text-stone-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-stone-300 disabled:shadow-none disabled:hover:bg-transparent";
    case "SPECIAL":
      return "inline-flex h-8 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-4 text-xs font-medium tracking-wide text-fuchsia-500 transition duration-300 hover:bg-fuchsia-100 hover:text-fuchsia-600 focus:bg-fuchsia-200 focus:text-fuchsia-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-fuchsia-300 disabled:shadow-none disabled:hover:bg-transparent";
    case "MESSAGE":
      return "inline-flex h-8 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-4 text-xs font-medium tracking-wide text-amber-500 transition duration-300 hover:bg-amber-100 hover:text-amber-600 focus:bg-amber-200 focus:text-amber-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-amber-300 disabled:shadow-none disabled:hover:bg-transparent";
    default:
      return "inline-flex h-8 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-4 text-xs font-medium tracking-wide text-cyan-500 transition duration-300 hover:bg-cyan-100 hover:text-cyan-600 focus:bg-cyan-200 focus:text-cyan-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-cyan-300 disabled:shadow-none disabled:hover:bg-transparent";
  }
}

function classNameDiv(type: TNotif) {
  switch (type) {
    case "ERROR":
      return "border-rose-100 bg-rose-50 text-rose-500";
    case "CLASSICAL":
      return "border-stone-100 bg-stone-50 text-stone-500";
    case "SPECIAL":
      return "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-500";
    case "MESSAGE":
      return "border-amber-100 bg-amber-50 text-amber-500";
    default:
      return "border-cyan-100 bg-cyan-50 text-cyan-500";
  }
}
