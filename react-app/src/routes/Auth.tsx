import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../functions/useAuth";
import { getCurrentUser } from "../Api-axios";

export default function Auth() {
  let [searchParams] = useSearchParams();
  const { data: authResp, isLoading, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: () =>
      axios
        .post<{login: string, tfa: boolean}>(
          "/auth/login",
          { code: searchParams.get("code"), state: "state" },
          { withCredentials: true },
        )
        .then((res) => res.data),
  });

  const auth = useAuth();
  const navigate = useNavigate();
  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-300">
        <div className="h-96 w-96 animate-spin rounded-full border-8 border-slate-700 border-b-transparent"></div>
      </div>
    );
  if (isError) return <p>Lol.</p>;
  
  console.log(authResp);
  
  
  if (authResp.tfa) {
    navigate("/tfa?user=" + authResp.login);
  } else if (auth) {
    auth.logIn(authResp.login);
    navigate("/play");
  }
  return <h1>Lol, it's a bag bug</h1>;
}
