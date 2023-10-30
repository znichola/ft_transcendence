import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../functions/contexts";
import { useEffect } from "react";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const {setFTA, logIn} = useAuth();
  const navigate = useNavigate();
  const {
    data: authResp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth"],
    retry: false,
    queryFn: () =>
      axios
        .post<{ login: string; tfa: boolean }>(
          "/auth/login",
          { code: searchParams.get("code"), state: searchParams.get("state") },
          { withCredentials: true },
        )
        .then((res) => res.data),
  });

  useEffect(() => {
    if (!isLoading && !isError) {
      if (authResp.tfa) {
        setFTA(true);
        navigate("/tfa/" + authResp.login);
      } else {
        logIn(authResp.login, authResp.tfa);
        navigate("/play");
      }
    }
  });

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-300">
        <div className="h-96 w-96 animate-spin rounded-full border-8 border-slate-700 border-b-transparent"></div>
      </div>
    );
  if (isError) return <p>Lol.</p>;
  console.log("auth object", authResp);
  return <h1>Lol, it's a bag bug</h1>;
}
