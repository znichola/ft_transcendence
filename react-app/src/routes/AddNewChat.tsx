export default function AddNewChat() {
  return (
    <>
      <button onClick={() => console.log("Clicked button")}>
        <div className="rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 p-8 shadow ">
          <h1 className="text-2xl font-bold text-stone-50">
            Start a new chat with a user
          </h1>
        </div>
      </button>
    </>
  );
}
