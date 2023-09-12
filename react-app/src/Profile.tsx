import ProfileCard from "./ProfileCard.tsx";

export default function Profile() {
  return (
    <>
      <div className=" flex flex-col items-center gap-3">
        <h1 className=" p-2 text-8xl font-bold text-slate-700 ">My profile</h1>
        <ProfileCard />
      </div>
    </>
  );
}
