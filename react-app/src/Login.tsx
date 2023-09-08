import React, { useState } from "react";

export default function Login() {
  const [login, setLogin] = useState("");

  function onBTNclick(
    e: React.MouseEvent<HTMLInputElement, globalThis.MouseEvent>,
  ) {
    e.preventDefault();
    alert(login);
  }

  return (
    <>
      <h1 className="py-20 text-center text-5xl font-bold text-slate-800">
        Please log in with your <br />
        login information
      </h1>
      <form>
        <input
          type="text"
          placeholder="enter your login"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
        />
        <br />
        <input type="password" placeholder="enter your password" />
        <input type="submit" onClick={onBTNclick} />
      </form>
    </>
  );
}
