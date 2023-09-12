import { Form } from "react-router-dom";
import AllUsers from "./AllUsers";

export default function GlobalRanking() {
  return (
    <>
      <div>
        <h1 className="text-rose-700Í text-gradient-to-tl from-green-700 to-sky-600 p-10 text-center text-6xl font-bold text-stone-700">
          Here be ranked <br /> the best <br /> of the best
        </h1>
        {/* this still needs to be implemented, but it should be possible with the query string on the get whoever want's to should give it a crack*/}
        <Form>
          <input
            type="text"
            name="user search"
            placeholder="general user search"
          />
          <button className="rounded bg-sky-300 px-3 py-1 text-stone-50 ">
            Search
          </button>
          <div>
            online
            <input type="radio" />
          </div>
          <div>
            friend with me
            <input type="radio" />
          </div>
          <div>
            elo rank range
            <input type="range" />
          </div>
        </Form>
        {/* also pagination should be added for the all users selector, something to get it working properly */}
        <AllUsers />
      </div>
    </>
  );
}
