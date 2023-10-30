export default function Avatar({
  className,
  alt,
  status,
  img,
}: {
  className: string;
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
      case "INQUEUE":
        return "bg-pink-500";
      default:
        return "bg-red-700";
    }
  }
  return (
    <div className={`relative ${className}`}>
      <img
        className="h-full w-full rounded-full ring-2 ring-gray-100"
        src={img}
        alt={alt || "undefined" + " profile image"}
      />
      <div
        className={`group absolute bottom-0 right-0 h-3 w-3 rounded-full ${statusColor()} ring ring-white`}
      >
        {status === "INGAME" && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
        )}
        <span className="absolute left-1/2 hidden -translate-y-full translate-x-1 rounded-md border border-slate-100 bg-slate-50 p-1 px-2 text-sm capitalize text-slate-400 opacity-0 shadow-sm transition-opacity group-hover:flex group-hover:opacity-100 whitespace-nowrap">
          {status == "INQUEUE" ? "in queue" : status?.toLocaleLowerCase()}
        </span>
      </div>
    </div>
  );
}
