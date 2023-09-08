import { useRouteError } from "react-router-dom";

// issue with error types and stuff
// https://www.reddit.com/r/typescript/comments/12d2db3/whats_the_correct_type_for_error_in_userouteerror/

export default function ErrorPage() {
  const error: unknown = useRouteError();
  console.error(error);
  return (
    <div
      id="error-page"
      className="flex flex-col gap-8 justify-center items-center h-screen"
    >
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-slate-400">
        <i>
          {(error as Error)?.message ||
            (error as { statusText?: string })?.statusText}
        </i>
      </p>
    </div>
  );
}
