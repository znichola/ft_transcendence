import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../functions/useAuth";
import { useEffect } from "react";
// import { userSocket } from "../socket";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    data: authResp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth"],
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
        auth.setFTA(true);
        navigate("/tfa/" + authResp.login);
      } else if (auth) {
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
