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

export function Avatar({
  size,
  alt,
  status,
  img,
}: {
  size: string;
  alt: string | undefined;
  status: string | undefined;
  img: string | undefined;
}) {
  function statusColor() {
    switch (status) {
      case "online":
        return "bg-green-600";
      case "offline":
        return "bg-gray-300";
      case "ingame":
        return "bg-blue-400";
      case "unavailable":
        return "bg-red-500";
      default:
        return "bg-ping-700";
    }
  }
  console.log(status);
  return (
    <div className={`relative ${size}`}>
      <img
        className="rounded-full ring-2 ring-gray-100"
        src={img}
        alt={alt || "undefined" + " profile image"}
      />
      <div
        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${statusColor()} ring ring-white`}
      ></div>
    </div>
  );
}
