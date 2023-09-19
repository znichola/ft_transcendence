export default function ProfileElo({
  data,
  h = 160,
  w = 256,
  className = "",
}: {
  data: number[];
  h?: number;
  w?: number;
  className?: string;
}) {
  const normalizeData = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    return data.map((value) => ((value - min) / range) * h - h / 2);
  };

  const normalizedData = normalizeData(data);

  const stepSize = w / (normalizedData.length - 1);

  const pathString = normalizedData.map(
    (value, index) => `${index * stepSize} ${-value}`,
  );

  return (
    <svg
      className={className + " overflow-visible"}
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 -80 256 160"
      stroke="currentColor"
      width="100%"
      height="100%"
    >
      {/* <path d="M 0 0 Q 0 0, 50 -60 T 100 -40 150 -30 200 -40" /> */}
      <path
        d={"M 0 " + -normalizedData[0] + " L " + pathString}
        className="text-rose-400"
        strokeWidth={2.5}
      />
      <path
        d={"M 0 0 L " + w + " 0 "}
        className="text-slate-300"
        strokeWidth={1.3}
      />
      <text
        x={0}
        y={-5}
        className="font text-sm font-extralight text-slate-300"
      >
        {Math.floor(data.reduce((acc, n) => acc + n, 0) / data.length)}
      </text>
    </svg>
  );
}
