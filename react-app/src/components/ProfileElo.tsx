export default function ProfileElo({
  data,
  className = "",
}: {
  data: number[];
  className?: string;
}) {
  return (
    <svg
      className={className}
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 190 160"
      stroke="currentColor"
    >
      {/* width="190" height="160" xmlns="http://www.w3.org/2000/svg"> */}
      <path
        d="M 10 80 Q 52.5 10, 95 80 T 180 80"
        stroke="black"
        fill="transparent"
      />
    </svg>
  );
}
