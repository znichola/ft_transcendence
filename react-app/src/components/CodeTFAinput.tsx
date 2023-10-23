import { useState } from "react";
import { Form } from "react-router-dom";

export function CodeInput({
  error,
  code,
  setCode,
  submit,
}: {
  error: boolean;
  code: string;
  submit: () => void;
  setCode: (value: string) => void;
}) {
  const [color, setColor] = useState<"bg-rose-500" | "bg-sky-500">(
    "bg-sky-500",
  );
  return (
    <Form
      onSubmit={submit}
      className="flex w-64 flex-col rounded-xl bg-stone-200 px-7 py-5 font-bold text-stone-500 shadow"
    >
      <h1 className="text-3xl ">~2FA code</h1>
      {error ? (
        <p className="py-1 text-base text-rose-400">bad code, try again</p>
      ) : (
        <p className="py-1 text-base">enter code to sign in</p>
      )}
      <div className="relative flex justify-center py-2">
        <input
          className=" z-10 rounded bg-transparent px-6 py-2 font-mono text-3xl uppercase  tracking-[0.3em] text-slate-500 outline-none"
          type="text"
          size={6}
          maxLength={6}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setColor("bg-sky-500");
          }}
        />
        <div className="absolute z-0 rounded bg-stone-50 px-6 py-2 font-mono text-3xl uppercase tracking-[0.3em] text-slate-300 outline-none ">
          {code.padEnd(6, "_")}
        </div>
      </div>
      <div className="flex justify-center pt-2">
        <button className={` w-24 p-2 text-stone-50 ${color} rounded-full`}>
          sumbit
        </button>
      </div>
    </Form>
  );
}
