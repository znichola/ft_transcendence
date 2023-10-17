import { ReactNode } from "react";
import { TChatroomRole } from "../interfaces";

export interface IGenericActionBTN {
  onUnChecked: () => void;
  onChecked: () => void;
  value: boolean;
  actionPerms: TChatroomRole;
  viewPerms: TChatroomRole;
  cardRole: TChatroomRole | undefined;
  fixedChecked?: ReactNode;
  checked: ReactNode;
  unChecked: ReactNode;
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
  checked,
  fixedChecked,
  unChecked,
}: IGenericActionBTN) {
  const vp = convertPerms(viewPerms);
  const ap = convertPerms(actionPerms);
  const up = convertPerms(cardRole);
  console.log(vp, ap, up, "card", cardRole);
  if (up < vp) return <Empty />;
  if (up < ap)
    return value ? fixedChecked ? fixedChecked : <Empty /> : <Empty />;
  return value ? (
    <button onClick={onChecked}>{checked}</button>
  ) : (
    <button onClick={onUnChecked}>{unChecked}</button>
  );
}

function Empty() {
  return <div className="h-5 w-5 " />;
}
