export default function Login() {
  return (
    <>
      <AuthButton />
    </>
  );
}

export const AuthButton = () => {
  const authUrl =
    "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-49312eda4d8cf2f2d52a18799fa8685046a83b1dc7cd91101d63a63bb3dee558&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth&response_type=code"; // Replace with your authentication URL

  const handleAuthButtonClick = () => {
    // Redirect the user to the authentication URL
    window.location.href = authUrl;
  };

  return (
    <div>
      <button
        onClick={handleAuthButtonClick}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Authenticate
      </button>
    </div>
  );
};
