import { Form, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useMemo, useState } from "react";
import { authApi } from "../Api-axios";

export default function AuthLoginTFA() {
  const u = useQueryParam().get("user");
  const user = u || "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-sky-300">
      <CodeInput user={user} />
    </div>
  );
}

function useQueryParam() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

function CodeInput({ user }: { user: string }) {
  const [code, setCode] = useState("");
  const [color, setColor] = useState<"bg-rose-500" | "bg-sky-500">(
    "bg-sky-500",
  );
  const authContext = useAuth();
  const navigate = useNavigate();
  return (
    <Form
      onSubmit={() => {
        console.log("Sumbitted this code: ", code);
        setCode("");
      }}
      className="flex w-64 flex-col rounded-xl bg-stone-200 px-7 py-5 font-bold text-stone-500 shadow"
    >
      <h1 className="text-3xl ">~2FA code</h1>
      <p className="py-1 text-base">enter to sign in</p>
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

function QRcode({ img }: { img: string }) {
  return (
    <div className="w-64">
      <div className="overflow-hidden rounded-xl bg-stone-200 p-7 text-stone-800 shadow">
        <img className="aspect-square w-full" src={img} alt="qrcode" />
        <p className="pt-3 text-center ">
          Open the google
          <br />
          <b className="italic text-sky-400">authentication app</b>
          <br />
          and scan this QRcode
        </p>
      </div>
    </div>
  );
}
