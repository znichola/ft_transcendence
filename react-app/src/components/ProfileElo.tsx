export default function ProfileElo({
  data,
  h = 160,
  w = 256,
  className = "",
  fontSize = "",
  lineWidth = 5,
}: {
  data: number[];
  h?: number;
  w?: number;
  className?: string;
  lineWidth: number;
  fontSize: string;
}) {
  const normalizeData = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    return data.map((value) => ((value - min) / range) * h - h / 2);
  };

  const normalizedData = normalizeData(data);

  const stepSize = w / (normalizedData.length - 1);

  const points: [number, number][] = normalizedData.map((value, index) =>
    [index * stepSize, -value],
  );

  const pathString: string = points.map((point, index) => 
    bezierCommand(point, index, points)
  ).join(' ');

  return (
    <svg
      className={className + " overflow-visible"}
      strokeWidth="1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={"0 -80 " + w + " " + h}
      fill="none"
      stroke="currentColor"
      width="100%"
      height="100%"
    >
      {/* <path d="M 0 0 Q 0 0, 50 -60 T 100 -40 150 -30 200 -40" /> */}
      <path
        d={"M 0 0 L " + w + " 0 "}
        className="text-slate-300"
        strokeWidth={lineWidth / 2}
      />
      <path
        d={"M 0 " + points[0][1] + " " + pathString}
        className="text-rose-400"
        strokeWidth={lineWidth}
      />
      <text
        x={0}
        y={-5}
        className={"fill-current font-light text-sky-500 " + fontSize}
      >
        {Math.floor(data.reduce((acc, n) => acc + n, 0) / data.length)}
      </text>
    </svg>
  );
}

const line = (pointA: [number, number], pointB: [number, number]) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  };
};

const controlPoint = (
  current: [number, number],
  previous: [number, number],
  next: [number, number],
  reverse: boolean = false,
) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current;
  const n = next || current; // The smoothing ratio
  const smoothing = 0.2; // Properties of the opposed-line
  const o = line(p, n); // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing; // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;
  return [x, y];
};

// First point of <a> sould be the origin point of the path and not the first to draw
const bezierCommand = (
  point: [number, number],
  i: number,
  a: [number, number][],
): string => {
  if (i == 0) {
    return '';
  }
  // start control point
  const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point); // end control point
  const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
};
