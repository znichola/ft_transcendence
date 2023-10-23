import axios from "axios";
import { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { useAuth } from "../functions/useAuth";
import { socketSetHeadersAndReConnect } from "../socket";
import { randString } from "../functions/utils";

export default function Login() {
  const foo = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-sky-300">
      <AuthButton />
      {import.meta.env.MODE == "development" ? <DevLogin /> : <></>}
      {foo?.isloggedIn ? (
        <a href="/play" className="text-rose-50 underline">
          if you don't get redirected automatically, click here
        </a>
      ) : (
        <></>
      )}
    </div>
  );
}

const AuthButton = () => {
  const authRedirectionUrl =
    "https://api.intra.42.fr/oauth/authorize?client_id=" +
    import.meta.env.VITE_CLIENT_ID +
    "&redirect_uri=" +
    encodeURIComponent(import.meta.env.VITE_SITE_URL) +
    "%2Fauth&state=" +
    randString(10) +
    "&response_type=code"; // Replace with your authentication URL

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
          .then(async () => {
            authContext.logIn(login);
            authContext.setFTA(true);
            console.log(authContext);
            navigate("/play");
            await socketSetHeadersAndReConnect(login);
            console.log("dev: signed in!");
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
