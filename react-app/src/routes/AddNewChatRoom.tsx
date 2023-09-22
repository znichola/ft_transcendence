export default function AddNewChatRoom() {
  return (
    <>
      <button onClick={() => console.log("Clicked button")}>
        <div className="rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 p-8 shadow ">
          <h1 className="text-2xl font-bold text-stone-50">
            Create a new chat Room
          </h1>
        </div>
      </button>
    </>
  );
}
