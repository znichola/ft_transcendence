export default function Profile() {
  const friend_count = 2;
  const number_of_victories = 1;
  const rank = 10;
  return (
    <>
      <div className=" flex flex-col gap-3 items-center">
        <h1 className="  text-xl p-2 ">My profile</h1>
        <div className=" flex gap-2 bg-lime-400 p-5  rounded-3xl  text-lime-800 ">
          <img className=" rounded-full" src="https://picsum.photos/100" />
          <div className="flex flex-col">
            <div className="">User Defaultus</div>
            <div>friends: {friend_count}</div>
            <div>numeber of victories: {number_of_victories} </div>
            <div>rank: {rank} </div>
          </div>
        </div>
      </div>
    </>
  );
}
