import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { getCurrentUser } from "../Api-axios";
import { useCurrentUser } from "../functions/customHook";

export default function Auth() {
  let [searchParams] = useSearchParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: () =>
      axios
        .post(
          "/auth/login",
          { code: searchParams.get("code"), state: "state" },
          { withCredentials: true },
        )
        .then((res) => res.data),
  });
  const {
    data: user,
    isError: cuError,
    isLoading: cuLoading,
  } = useCurrentUser();
  const auth = useAuth();
  const navigate = useNavigate();
  if (isLoading || cuLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-sky-300">
        <div className="h-96 w-96 animate-spin rounded-full border-8 border-slate-700 border-b-transparent"></div>
      </div>
    );
  if (isError || cuError) return <p>Lol.</p>;
  if (auth) {
    auth.logIn(user);
    navigate("/play");
  }
  return <h1>Lol, it's a bag bug</h1>;
}
