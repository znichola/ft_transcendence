import { useRouteError } from "react-router-dom";

// issue with error types and stuff
// https://www.reddit.com/r/typescript/comments/12d2db3/whats_the_correct_type_for_error_in_userouteerror/

// should use this fuction when we have a connection error!
// TODO: refactor it so it can take an optional argument for the error message
export default function ErrorPage() {
  const error: unknown = useRouteError();
  console.error(error);
  return (
    <div
      id="error-page"
      className="flex h-screen flex-col items-center justify-center gap-8"
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
