import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { postTFACodeLogin } from "../api/axios";
import { CodeInput } from "../components/CodeTFAinput";
// import { authApi } from "../Api-axios";

export default function AuthLoginTFA() {
  const { login42 } = useParams<"login42">();

  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { isLoading, isError, isSuccess } = useQuery({
    enabled: submitted,
    retry: false,
    queryFn: () => postTFACodeLogin(login42 || "", code),
  });

  useEffect(() => {
    if (isError && submitted) {
      setSubmitted(false);
      setCode("");
    }
    if (isSuccess) navigate("/play");
  }, [isError, submitted, navigate, isSuccess]);

  if (isSuccess) return <p>it worked!!!</p>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-sky-300">
      {isLoading && submitted ? (
        <div className="h-96 w-96 animate-spin rounded-full border-8 border-slate-700 border-b-transparent" />
      ) : (
        <div className="bg-stone-200 font-bold text-stone-500 shadow">
          <CodeInput
            code={code}
            setCode={setCode}
            error={isError}
            submit={() => setSubmitted(true)}
          />
        </div>
      )}
    </div>
  );
}
