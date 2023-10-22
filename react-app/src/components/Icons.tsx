export type iconType = ({
  className,
  strokeSize,
}: {
  className?: string;
  strokeSize?: number;
}) => JSX.Element;

// These are all SVG icons !

export const IconNewspaper = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  );
};

export const IconPeople = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
};

export const IconGroupChatBubble = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    </svg>
  );
};

export const IconChatBubble = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
};

export const IconHomeComputer = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
      />
    </svg>
  );
};

export const IconBashShell = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
};

export const IconBolt = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
      />
    </svg>
  );
};

export const IconAtSymbol = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25"
      />
    </svg>
  );
};

export const IconDownChevron = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
};

export const IconWorld = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76m11.928 9.869A9 9 0 008.965 3.525m11.928 9.868A9 9 0 118.965 3.525"
      />
    </svg>
  );
};

export const IconUser = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
};

export const IconUserGroup = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  );
};

export const IconHeart = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
};

export const IconFire = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
      />
    </svg>
  );
};

export const IconMegaphone = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
      />
    </svg>
  );
};

export const IconAddUser = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
      />
    </svg>
  );
};

export const IconAdd = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

export const IconAddPulse = ({
  className = "h-5 w-5 align-middle text-rose-600",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <div>
      <span className="relative flex h-5 w-5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-10 "></span>
        <svg
          className={className}
          strokeWidth={strokeWidth}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </span>
    </div>
  );
};

export const IconBrain = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 159.89 132.24"
      fill="currentColor"
    >
      <path d="M75.41.05A35,35,0,0,1,88.26,1.72c9.33,3.12,19.17,3.11,28.66,5,13.62,2.71,24.06,10,29.3,23.43.63,1.61.56,3.54,1.94,4.76,5.33,4.69,12.24,14.51,9.85,24.83a9.12,9.12,0,0,0,.57,4.87c3.61,11.8-.32,22.88-10.52,29.65-1.54,1-3.07,1.79-3.42,3.94-2.07,12.59-18.07,17.8-33.16,16.74-3.56-.25-3.81.8-2.57,4.07a48,48,0,0,1,1.88,6.58c.43,1.89,1.52,4.07-.49,5.6-2.79,2.12-12,.83-14.12-2.12-5.93-8.25-11.92-16.45-17.61-24.86-2.16-3.19-4.46-4.38-8.32-3.61-6.94,1.38-12.9-.55-17-6.61-1.49-2.19-3.43-2.77-5.93-2.92-8.5-.5-16.65-1.94-21.68-10a3.32,3.32,0,0,0-3.44-1.57C4.13,81.9-4.08,63.33,2,46.48c5.76-16.06,17.56-25.9,33.32-31.35a22.37,22.37,0,0,0,7.64-4.38C52.22,2.72,63.58.54,75.41.05ZM89,11.8c-4.32-.46-7.44-1.09-10.56-1.08-8.84,0-17.6.36-25.56,5.19C42.76,22,41,36,49.84,43.45c2.6,2.19,3,4,1.37,6.76-1.9,3.2-4.36,1.9-6.44.64-2.71-1.64-4.93-2.57-7.22.59-1.28,1.77-3.08,1.63-4.89.54s-1.86-2.68-1.25-4.36c4-10.92,3.45-16.2.82-18.81-2-1.95-9,4.45-11.82,7.1-7.5,7-11.14,14.35-9.35,25,1.42,8.46,8.84,10.74,15.63,5.63,2.43-1.83,4.79-5.57,8.56-3.24,4,2.45.73,5.81,0,8.52-1.26,4.83,1.25,6.85,5,8.21,5.54,2,8,0,10.39-5.36,3.9-8.52,10.1-8.18,13.67-20.58.76-2.61,1.7-5.45,5.28-4.72s2.9,3.79,2.57,6.11c-.55,3.79,1.11,4.57,4.44,4.48,5.77-.16,11.56.2,17.33,0,4.3-.18,5.51,7.37.31,8.31a45.82,45.82,0,0,1-12.92.49A23.42,23.42,0,0,0,64,73.54c-4.2,3.3-5.23,7.23-3.16,11.39C63.07,89.42,65.9,90.54,71.7,89c12.18-3.24,24-8.12,37.06-7.12,2.46.19,2.61-1.11,2.14-3.17a24.38,24.38,0,0,1,1.88-16.54c1.33-2.78,3-3.6,5.94-2.56s4,2.62,3,5.65a16.52,16.52,0,0,0,.44,12.21c2.53,5.44,7,8.25,13,8.67,5.33.38,9.52-1.38,12-6.27,2.72-5.35,1.41-7.41-4.43-7.77-2.69-.16-6.07.07-6.6-3.8s1.3-6.05,5.43-6.71,6.3-3.59,6.28-7.81c0-7.42-5.33-12.91-12.76-13.45-8.59-.62-15.62,2.61-21.39,8.77-2.08,2.22-4.14,2.61-6.56.83s-1.47-4-.17-5.71c2.59-3.36.06-9.87-2-14.09-1-2.16-.89-4.82,2-5.88s4.6.22,5.87,3c1.5,3.24,4,5.38,8,4.64s8.05-1.66,12.66-2.62c-6.46-9-14.81-13.4-25.61-12.91C92.93,17,85.7,27.46,90.37,41.53c1.18,3.54-.39,5.39-2.25,6.74-2,1.46-5.21-.72-8.45-8-1.2-2.71-2.56-3.42-6-3.65C62.73,35.87,59.12,32,59.5,29.35c.26-1.88,3.24-4.51,5.11-3.8,2.59,1,12.36,2.07,15.15-2A79.65,79.65,0,0,1,89,11.8Z" />
    </svg>
  );
};

export const IconFingerPrint = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"
      />
    </svg>
  );
};

export const IconTendingUp = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    </svg>
  );
};

export const IconGit = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 92 92"
      fill="currentColor"
    >
      <defs>
        <clipPath id="a">
          <path d="M0 .113h91.887V92H0Zm0 0" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)">
        <path d="M90.156 41.965 50.036 1.848a5.913 5.913 0 0 0-8.368 0l-8.332 8.332 10.566 10.566a7.03 7.03 0 0 1 7.23 1.684 7.043 7.043 0 0 1 1.673 7.277l10.183 10.184a7.026 7.026 0 0 1 7.278 1.672 7.04 7.04 0 0 1 0 9.957 7.045 7.045 0 0 1-9.961 0 7.038 7.038 0 0 1-1.532-7.66l-9.5-9.497V59.36a7.04 7.04 0 0 1 1.86 11.29 7.04 7.04 0 0 1-9.957 0 7.04 7.04 0 0 1 0-9.958 7.034 7.034 0 0 1 2.308-1.539V33.926a7.001 7.001 0 0 1-2.308-1.535 7.049 7.049 0 0 1-1.516-7.7L29.242 14.273 1.734 41.777a5.918 5.918 0 0 0 0 8.371L41.855 90.27a5.92 5.92 0 0 0 8.368 0l39.933-39.934a5.925 5.925 0 0 0 0-8.371" />
      </g>
    </svg>
  );
};

export const IconGear = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
};

export const IconMinusCircle = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const IconPlusCircle = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export const IconCheckBadge = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
      />
    </svg>
  );
};

export const IconCheckBadgeFilled = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const IconCrown = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8L19 20H5L3 8M21 8L15.5 12.5L12 7M21 8C21.8284 8 22.5 7.32843 22.5 6.5C22.5 5.67157 21.8284 5 21 5C20.1716 5 19.5 5.67157 19.5 6.5C19.5 7.32843 20.1716 8 21 8ZM12 7L8.5 12.5L3 8M12 7C12.8284 7 13.5 6.32843 13.5 5.5C13.5 4.67157 12.8284 4 12 4C11.1716 4 10.5 4.67157 10.5 5.5C10.5 6.32843 11.1716 7 12 7ZM3 8C3.82843 8 4.5 7.32843 4.5 6.5C4.5 5.67157 3.82843 5 3 5C2.17157 5 1.5 5.67157 1.5 6.5C1.5 7.32843 2.17157 8 3 8Z"
      />
    </svg>
  );
};

export const IconSearch = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
};

export const IconBin = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
};

export const IconSent = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 32,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 512 512"
      stroke="currentColor"
    >
      <path
        d="M53.12 199.94l400-151.39a8 8 0 0110.33 10.33l-151.39 400a8 8 0 01-15-.34l-67.4-166.09a16 16 0 00-10.11-10.11L53.46 215a8 8 0 01-.34-15.06zM460 52L227 285"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IconFunnel = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 1.5,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
      />
    </svg>
  );
};

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth={1.5}
  stroke="currentColor"
  className="h-6 w-6"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
  />
</svg>;

export const IconArrowUturnLeft = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
      />
    </svg>
  );
};

export const IconStop = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
      />
    </svg>
  );
};

export const IconMute = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
      />
    </svg>
  );
};

export const IconStopCircle = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z"
      />
    </svg>
  );
};

export const IconX = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export const IconTrophy = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <path
        fill="#F7B239"
        d="M278.458,248.702v119.656h-44.916V248.702c7.311,3.154,14.819,4.8,22.464,4.8
			C263.651,253.501,271.147,251.856,278.458,248.702z"
      />
      <path
        fill="#E09B2D"
        d="M257.243,250.192v116.675h-23.701V250.192c3.858,3.078,7.82,4.686,11.854,4.686
			C249.43,254.878,253.385,253.27,257.243,250.192z"
      />
      <path
        fill="#F7B239"
        d="M327.765,355.874v50.98H184.235v-50.98c0-5.403,4.38-9.782,9.782-9.782h39.525h44.916h39.525
			C323.385,346.092,327.765,350.472,327.765,355.874z"
      />
      <path
        fill="#E09B2D"
        d="M212.711,346.092v60.762h-28.476v-50.98c0-5.403,4.38-9.782,9.782-9.782l0,0h8.911H212.711z"
      />
      <path
        fill="#F95428"
        d="M360.447,406.442v101.022c0,2.505-2.031,4.536-4.536,4.536H156.089c-2.505,0-4.536-2.031-4.536-4.536
			V406.442c0-2.505,2.031-4.536,4.536-4.536h28.146h143.531h28.146C358.416,401.906,360.447,403.937,360.447,406.442z"
      />
      <path
        fill="#E54728"
        d="M180.548,401.906V512h-24.459c-2.505,0-4.536-2.031-4.536-4.536V406.442
			c0-2.505,2.031-4.536,4.536-4.536l0,0h19.923L180.548,401.906L180.548,401.906z"
      />
      <path
        fill="#F7B239"
        d="M403.904,48.615h-10.28c0.396-5.814,0.68-11.69,0.866-17.615c0.136-4.701,0.21-9.451,0.21-14.226
			H117.3c0,4.775,0.074,9.525,0.21,14.226c0.186,5.925,0.47,11.801,0.866,17.615c0.73,10.527,1.794,20.844,3.204,30.925
			c5.468,39.337,15.957,75.013,30.146,104.59c5.381,11.22,11.306,21.574,17.689,30.913c18.184,26.633,40.116,45.064,64.127,52.214
			c7.311,2.177,14.819,3.315,22.464,3.315c7.645,0,15.141-1.138,22.452-3.315c24.01-7.15,45.93-25.581,64.127-52.202h48.825
			c23.033,0,42.739-16.564,46.71-39.25l12.506-71.611C455.685,75.186,433.357,48.615,403.904,48.615z M420.17,98.862l-12.519,71.623
			c-1.373,7.905-8.214,13.644-16.242,13.644h-31.136c14.189-29.577,24.678-65.252,30.158-104.59h13.471
			c6.692,0,10.787,3.686,12.63,5.888C418.389,87.618,421.308,92.294,420.17,98.862z"
      />
      <g>
        <path
          fill="#E09B2D"
          d="M247.162,267.257c-9.451-7.15-18.085-25.581-25.247-52.214c-2.511-9.339-4.849-19.693-6.964-30.913
				c-5.591-29.577-9.723-65.252-11.875-104.59c-0.544-10.082-0.965-20.398-1.249-30.925c-0.285-10.428-0.433-21.054-0.433-31.841
				H117.3c0,10.787,0.371,21.413,1.076,31.841h-10.292c-29.441,0-51.769,26.571-46.71,55.579l12.506,71.611
				c3.958,22.687,23.664,39.25,46.722,39.25h48.821c18.182,26.627,40.111,45.053,64.118,52.202c7.311,2.177,14.819,3.315,22.464,3.315
				C252.988,270.572,250.031,269.434,247.162,267.257z M104.348,170.485L91.854,98.875c-1.15-6.581,1.769-11.257,3.624-13.459
				c1.843-2.19,5.938-5.876,12.618-5.876h13.483l0,0c5.468,39.337,15.957,75.013,30.146,104.59h-31.123
				C112.562,184.13,105.721,178.39,104.348,170.485z"
        />
        <path
          fill="#E09B2D"
          d="M394.7,16.774c0,4.775-0.074,9.525-0.21,14.226H117.51c-0.136-4.701-0.21-9.451-0.21-14.226
				C117.3,16.774,394.7,16.774,394.7,16.774z"
        />
      </g>
      <path
        fill="#F7B239"
        d="M402.629,0H109.371C103.202,0,98.2,5.001,98.2,11.17l0,0c0,6.169,5.001,11.17,11.17,11.17h293.259
			c6.169,0,11.17-5.001,11.17-11.17l0,0C413.8,5.001,408.798,0,402.629,0z"
      />
      <path
        fill="#E09B2D"
        d="M150.155,11.17c0-6.169,5.001-11.17,11.17-11.17h-51.955C103.202,0,98.2,5.001,98.2,11.17
			s5.001,11.17,11.17,11.17h51.955C155.156,22.34,150.155,17.339,150.155,11.17z"
      />
    </svg>
  );
};

export const IconVS = ({
  className = "h-5 w-5 align-middle",
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) => {
  return (
    <svg
      className={className}
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="Gradient1" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="rgb(192 38 211)" offset="0%" />
          <stop stopColor="rgb(249 115 22)" offset="100%" />
        </linearGradient>
      </defs>
      <path
        d="M18.4961 10.7088L9.8603 19.5885 C9.6207 19.8349 9.22228 19.5503 9.37764 19.2437L12.4518 13.1779C12.553 12.9783 12.408 12.7423 12.1842 12.7423H5.71762C5.45129 12.7423 5.31702 12.4211 5.5041 12.2315L13.5132 4.11699C13.7455 3.88157 14.132 4.14034 14.0029 4.44487L11.706 9.86069C11.6215 10.06 11.7694 10.2805 11.9859 10.2778L18.2773 10.1997C18.5444 10.1964 18.6823 10.5174 18.4961 10.7088Z"
        fill="url(#Gradient1)"
      />
    </svg>
  );
};
