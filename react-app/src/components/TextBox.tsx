import { useState } from "react";
import { putUserProfile } from "../Api-axios";

export default function EditBox({
  className,
  startText,
  maxChar,
  rows,
  putUpdate,
}: {
  className: string;
  startText: string;
  maxChar: number;
  rows: number;
  putUpdate: (e: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
}) {
  const [text, setText] = useState(startText);
  const [charRemainder, setCharRemainder] = useState(maxChar);
  const [isEditable, setEditable] = useState(false);
  return (
    <div className="grow-wrap relative w-full overflow-auto ">
      <textarea
        maxLength={maxChar}
        value={text}
        name="text"
        id="text"
        // onInput="this.parentNode.dataset.replicatedValue = this.value"
        rows={rows}
        autoComplete="off"
        onChange={(e) => {
          setCharRemainder(maxChar - e.target.value.length);
          setText(e.target.value);
        }}
        onBlur={(e) => {
          console.log("Saved:", e.target.value);
          putUpdate(e);
          setEditable(false);
        }}
        onFocus={() => setEditable(true)}
        className={`h-full w-full resize-none bg-inherit outline-none ${
          isEditable ? "text-sky-500 " : className
        }`}
      />
      <div
        className={`absolute bottom-0 right-0 text-base ${
          isEditable ? "visible" : "invisible"
        }`}
        // className={`absolute `}
      >
        <i className="rounded-md border border-slate-100 bg-slate-50 p-1 px-2 text-slate-300 shadow-sm">
          {charRemainder + " / " + maxChar}
        </i>
      </div>
    </div>
  );
}
