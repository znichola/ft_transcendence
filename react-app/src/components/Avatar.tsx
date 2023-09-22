export default function Avatar({
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
      case "ONLINE":
        return "bg-green-600";
      case "OFFLINE":
        return "bg-gray-300";
      case "INGAME":
        return "bg-blue-400";
      case "UNAVAILABLE":
        return "bg-red-500";
      default:
        return "bg-ping-700";
    }
  }
  return (
    <div className={`relative ${size}`}>
      <img
        className="rounded-full ring-2 ring-gray-100"
        src={img}
        alt={alt || "undefined" + " profile image"}
      />
      <div
        className={`group absolute bottom-0 right-0 h-3 w-3 rounded-full ${statusColor()} ring ring-white`}
      >
        {status === "INGAME" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
        )}
        <span className="absolute left-1/2 hidden -translate-y-full translate-x-1 rounded-md border border-slate-100 bg-slate-50 p-1 px-2 text-sm capitalize text-slate-400 opacity-0 shadow-sm transition-opacity group-hover:flex group-hover:opacity-100">
          {status?.toLocaleLowerCase()}
        </span>
      </div>
    </div>
  );
}
