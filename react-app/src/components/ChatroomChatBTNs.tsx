import { ReactNode } from "react";
import { IMember, TChatroomRole } from "../interfaces";

export interface IChatroomManageBTN {
  cardMember?: IMember;
  userMember?: IMember;
  userLogin42: string;
  isMember: boolean;
  id: string;
}

export interface IGenericActionBTN {
  onUnChecked: () => void;
  onChecked: () => void;
  value: boolean;
  actionPerms: TChatroomRole;
  viewPerms: TChatroomRole;
  cardRole: TChatroomRole | undefined;
  userRole: TChatroomRole | undefined;
  fixedChecked?: ReactNode;
  checked: ReactNode;
  unChecked: ReactNode;
  checkedMessage: string;
  unCheckedMessage: string;
}

export function convertPerms(perms: TChatroomRole | undefined) {
  return perms == undefined
    ? 0
    : perms == "MEMBER"
    ? 1
    : perms == "ADMIN"
    ? 2
    : 3;
}

export function GenericActionBTN({
  onUnChecked,
  onChecked,
  value,
  actionPerms,
  viewPerms,
  cardRole,
  userRole,
  checked,
  fixedChecked: fc,
  unChecked,
  checkedMessage: cm,
  unCheckedMessage: ucm,
}: IGenericActionBTN) {
  const v = convertPerms(viewPerms);
  const a = convertPerms(actionPerms);
  const u = convertPerms(userRole);
  const c = convertPerms(cardRole);
  // console.log("view:", v, "action", a, "user:", u, "card:", c, cardRole);
  if (u < v) return <Empty />;
  if (u < a)
    return value ? fc ? <Pop message={cm}>{fc}</Pop> : <Empty /> : <Empty />;
  if (u < c) return <Empty />;
  return value ? (
    <button onClick={onChecked}>{<Pop message={cm}>{checked}</Pop>}</button>
  ) : (
    <button onClick={onUnChecked}>
      {<Pop message={ucm}>{unChecked}</Pop>}
    </button>
  );
}

export function Pop({ message, children }: { message: string; children: ReactNode }) {
  console.log;
  return (
    <div className="group relative">
      {children}
      <span className="pointer-events-none absolute left-1/2 z-10 hidden -translate-y-10 translate-x-2 rounded-md border border-slate-100 bg-slate-50 p-1 px-2 text-sm capitalize text-slate-400 opacity-0 shadow-sm transition-opacity group-hover:flex group-hover:opacity-100">
        {message}
      </span>
    </div>
  );
}

function Empty() {
  return <div className="h-5 w-5 " />;
}
