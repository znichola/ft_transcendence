import { ReactNode, RefObject, useEffect, useRef } from "react";
import { iconType } from "./Icons";

export default function BoxMenu({
  resetBTN,
  heading,
  children,
}: {
  resetBTN?: () => void;
  heading: ReactNode;
  children?: ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  if (resetBTN) useOutsideAlerter(wrapperRef, resetBTN);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute z-10 top-0 w-full bg-clip-content lg:px-28 px-3 py-5"
    >
      {/* <div className="absolute left-0 top-0 z-0 h-[140%] w-full bg-gradient-to-b from-stone-50 to-transparent"></div> */}
      <div className="pointer-events-auto relative flex w-full flex-col items-center justify-between rounded-xl border-b-4 border-stone-300 bg-stone-50 bg-size-200 pt-6 shadow-lg">
        {heading}
        <div className="flex min-h-16 gap-2 overflow-visible pb-2 pt-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ButtonGeneric({
  icon: Icon,
  setBTNstate,
  buttonState,
  checked,
  children,
  filledIn,
}: {
  icon: iconType;
  setBTNstate: (value: React.SetStateAction<string>) => void;
  buttonState: string;
  checked: string;
  children?: JSX.Element[] | JSX.Element;
  filledIn?: boolean
}) {
  return (
    <div>
      <input
        type="checkbox"
        checked={buttonState === checked}
        onChange={() => "UNSET"}
        className="peer hidden"
      />
      <button
        onClick={() => setBTNstate(buttonState === checked ? "UNSET" : checked)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border-b-2 border-stone-300 text-slate-500 transition-all duration-100 hover:border-b-4 peer-checked:border-rose-400 peer-checked:text-rose-500  ${filledIn ? "bg-stone-200" : ""}`}
      >
        <div className="flex h-8 w-8 items-center justify-center">
          <Icon />
        </div>
      </button>
      <div className="invisible absolute left-0 min-w-full translate-y-5 p-3 opacity-0 transition-all duration-500 ease-in-out peer-checked:visible peer-checked:translate-y-10 peer-checked:opacity-100">
        {children}
      </div>
    </div>
  );
}

function useOutsideAlerter(
  ref: RefObject<HTMLDivElement>,
  setBTNstate: () => void,
) {
  useEffect(() => {
    //  Alert if clicked on outside of element
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        (!(event.target instanceof Node) || !ref.current.contains(event.target))
      ) {
        setBTNstate();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
