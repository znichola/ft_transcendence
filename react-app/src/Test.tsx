import { useQuery } from "@tanstack/react-query";
import { LoadingSpinnerMessage } from "./components";

export default function Test() {
  return (
    <>
      <div className="flex ">
        <div className="h-12 bg-pink-500">
          <div className="w-32 bg-blue-400">
            <p>foobar</p>
          </div>
        </div>
        <div className="grow bg-green-400">
          <p>fizbuz</p>
        </div>
      </div>
      <Example />
    </>
  );
}

function Example() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://a").then((res) =>
        res.json(),
      ),
  });

  if (isLoading) return <LoadingSpinnerMessage />;

  if (error) return "An error has occurred: " + (error as Error)?.message;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{" "}
      <strong>✨ {data.stargazers_count}</strong>{" "}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  );
}