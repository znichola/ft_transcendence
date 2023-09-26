// https://tailwindcomponents.com/search?query=loading

export function LoadingSpinnerMessage({ message }: { message?: string }) {
  return (
    <>
      <div className="mb-4 flex items-center justify-center gap-1">
        <LoadingSpinner />
        <p className="text-slate-700">{message || "Loading" + "..."}</p>
      </div>
    </>
  );
}

export function LoadingDots() {
  return (
    <>
      <div className="min-w-screen flex min-h-screen items-center justify-center bg-slate-100 p-5">
        <div className="flex animate-pulse space-x-2">
          <div className="h-3 w-3 rounded-full bg-slate-500"></div>
          <div className="h-3 w-3 rounded-full bg-slate-500"></div>
          <div className="h-3 w-3 rounded-full bg-slate-500"></div>
        </div>
      </div>
    </>
  );
}

export function LoadingSpinner() {
  return (
    <>
      <div
        className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-b-transparent"
      ></div>
    </>
  );
}