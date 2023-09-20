import { Form } from "react-router-dom";
import AllUsers from "./AllUsers";
import { IconDownChevron } from "../components/Icons";

export default function GlobalRanking() {
  return (
    <div className="flex max-h-screen flex-col items-center overflow-y-auto">
      <h1 className=" bg-gradient-to-tl from-green-700 to-sky-600 bg-clip-text p-10 text-center text-6xl font-bold text-transparent">
        Here be ranked <br /> the best <br /> of the best
      </h1>
      {/* this still needs to be implemented, but it should be possible with the query string on the get whoever want's to should give it a crack*/}
      <Form className="relative flex max-w-[23rem] flex-col items-center justify-center rounded-md p-4">
        <div>
          <input
            type="text"
            name="user search"
            placeholder="Search an user..."
            className="w-86 rounded-full py-2 pl-4 pr-4"
          />
          <button className="rounded-full bg-sky-300 px-3 py-2 text-stone-50 ">
            Search
          </button>
        </div>
        <input
          className="peer hidden"
          type="checkbox"
          id="filter"
          defaultChecked={false}
        />
        <label
          htmlFor="filter"
          className="flex cursor-pointer items-center self-start pt-2 pl-4 pr-5 underline"
        >
          {"Filters"}
        </label>
        <IconDownChevron className="h-4 translate-x-[-6rem] pointer-events-none translate-y-[-1.22rem] px-1 transition peer-checked:rotate-90" />
        <div className="relative flex flex-col max-h-0 min-w-full overflow-y-auto px-5 peer-checked:max-h-20">
					<div className="flex">
						<div className="flex grow gap-1">
							online
							<input type="checkbox" />
						</div>
						<div className="flex gap-1">
							friend with me
							<input type="checkbox" />
						</div>
					</div>
					<div className="flex min-w-full gap-5">
						<p className="">elo rank range</p>
						<input type="range" className="w-32"/>
					</div>
        </div>
      </Form>
      {/* also pagination should be added for the all users selector, something to get it working properly */}
      <AllUsers />
    </div>
  );
}
