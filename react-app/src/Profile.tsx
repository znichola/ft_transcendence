import ProfileCard from "./ProfileCard.tsx"

export default function Profile() {
  return (
    <>
      <div className=" flex flex-col gap-3 items-center">
        <h1 className=" text-8xl font-bold p-2 text-slate-700 ">My profile</h1>
        <ProfileCard />
      </div>
    </>
  );
}
