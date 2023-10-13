import axios from "axios";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-sky-300">
      <AuthButton />
      <Logout />
      {/* <QRcode
        img={
          "https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg"
        }
      /> */}
      <DevLogin />
    </div>
  );
}

const AuthButton = () => {
  const authRedirectionUrl =
    "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-49312eda4d8cf2f2d52a18799fa8685046a83b1dc7cd91101d63a63bb3dee558&redirect_uri=http%3A%2F%2F" +
    import.meta.env.VITE_IP_ADDR +
    "%3A8080%2Fauth&state=abc&response_type=code"; // Replace with your authentication URL

  console.log(authRedirectionUrl);

  const handleAuthButtonClick = () => {
    // Redirect the user to the authentication URL
    window.location.href = authRedirectionUrl;
  };

  return (
    <button
      onClick={handleAuthButtonClick}
      className=" w-64 rounded-xl bg-stone-200 py-5 font-bold text-stone-500 shadow"
    >
      <h1 className="text-3xl ">Authenticate</h1>
      <p className="text-lg ">
        with your <b className="italic text-sky-400">42</b> account
      </p>
    </button>
  );
};

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

function Logout() {
  const authContext = useAuth();
  const [color, setColor] = useState<"text-rose-500" | "text-stone-500">(
    "text-stone-500",
  );
  const [message, setMessage] = useState("");

  return (
    <button
      onClick={() =>
        axios
          .get<string>("/auth/logout")
          .then((r) => {
            r.data;
            authContext?.logOut();
          })
          .catch((e) => {
            if (e.response.status == 401) setColor("text-rose-500");
            setMessage(e.response.status + " " + e.response.statusText);
            setTimeout(() => {
              setColor("text-stone-500");
              setMessage("");
            }, 2000);
          })
      }
      className={`relative py-5 w-64 rounded-xl bg-stone-200 px-3 text-center font-bold shadow ${color}`}
    >
      <h1 className="text-3xl ">Logout</h1>
      <label className="absolute w-full start-0 font-base text-xs text-stone-400">{message}</label>
    </button>
  );
}

function DevLogin() {
  const [login, setLogin] = useState("default42");
  const [color, setColor] = useState<"bg-rose-500" | "bg-sky-500">(
    "bg-sky-500",
  );
  const authContext = useAuth();
  const navigate = useNavigate();
  return (
    <Form
      onSubmit={() => {
        axios
          .get("/auth/dev/", { params: { user: login } })
          .then(() => {
            authContext?.logIn(login);
            console.log(authContext);
            navigate("/play");
            console.log("signed in!");
          })
          .catch(() => setColor("bg-rose-500"));
      }}
      className="flex w-64 flex-col rounded-xl bg-stone-200 px-7 py-5 font-bold text-stone-500 shadow"
    >
      <h1 className="text-3xl ">~dev only</h1>
      <p className="text-base ">
        sign in as<b className="italic text-sky-400"> {login}</b>
      </p>
      <div className="flex gap-2 pt-2">
        <input
          className="w-full rounded px-2 font-medium outline-none"
          type="text"
          value={login}
          onChange={(e) => {
            setLogin(e.target.value);
            setColor("bg-sky-500");
          }}
        />
        <button className={`h-8 w-6 ${color} rounded-full`} />
      </div>
    </Form>
  );
}
