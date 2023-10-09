import axios  from "axios";
import { useQuery } from "@tanstack/react-query";

export default function Login() {
  // useQuery({
  //   queryKey: ["auth"],
  //   queryFn: () =>
  //     axios
  //       .get("/auth/user", { withCredentials: true })
  //       .then((res) => res.data),
  // });
  return (
    <>
      <AuthButton />
      <QRcode
        img={
          "https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg"
        }
      />
      <DevDefault42Auth />
    </>
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

function DevDefault42Auth() {
  const { isError, isLoading, isFetching, refetch } = useQuery({
    enabled: false,
    queryKey: ["auth2"],
    queryFn: () =>
      axios
        .get<string>("/api/dev-auth-default42")
        .then((r) => r.data)
        .catch((e) => console.log(e.data)),
  });

  if (isError)
    return (
      <div
        onClick={() => refetch()}
        className=" w-64 rounded-xl bg-stone-200 px-7 py-5 text-center font-bold text-stone-500 shadow"
      >
        error signing is a default42
      </div>
    );

  if (isLoading && isFetching)
    return (
      <div
        onClick={() => refetch()}
        className=" flex w-64 justify-center rounded-xl bg-stone-200 px-7 py-5 font-bold text-stone-500 shadow"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-b-transparent"></div>
      </div>
    );

  return (
    <button
      onClick={() => refetch()}
      className=" inline-block w-64 rounded-xl bg-stone-200 px-7 py-5 font-bold text-stone-500 shadow"
    >
      <h1 className="text-3xl ">For dev only</h1>
      <p className="text-lg ">
        sign in as<b className="italic text-sky-400"> default42</b>
      </p>
    </button>
  );
}
