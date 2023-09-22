import { Form } from "react-router-dom";
import AllUsers from "./AllUsers";
import { IconDownChevron } from "../components/Icons";
import {  } from "./AllUsers";
import { UserData } from "../interfaces";
import { useState } from "react";
import UserInfoCard from "../components/UserInfoCard";

const FilterMenu = function () {
  const [name_filter, changeNameFilter] = useState("");
  const [state_filter, changeOnlineFilter] = useState("NONE");

  const Filter = ({ user }: { user: UserData }) => {
    if (state_filter != "NONE" && !(user.status == state_filter)) return <></>;
    if (
      user.login42.toLowerCase().startsWith(name_filter) ||
      user.name.toLowerCase().startsWith(name_filter)
    )
      return <UserInfoCard user={user} key={user.login42} />;
    return <></>;
  };

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    changeNameFilter(event.target.value.toLowerCase());
  }

  function handleOnlineChange() {
		if (state_filter == "ONLINE") {
			changeOnlineFilter("NONE");
		}
		else {
			changeOnlineFilter("ONLINE");
		}
  }

  function handleOfflineChange() {
    if (state_filter == "OFFLINE") {
			changeOnlineFilter("NONE");
		}
		else {
			changeOnlineFilter("OFFLINE");
		}
  }

  function handleInGameChange() {
    if (state_filter == "INGAME") {
			changeOnlineFilter("NONE");
		}
		else {
			changeOnlineFilter("INGAME");
		}
  }

	function RadioStateButton({text, handler, state}) {
		return(
			<div className="flex min-h-[2rem] items-center gap-1">
          <input id={text} checked={state_filter == state} type="radio" name="State" className=" hidden peer"/>
          <label onClick={handler} htmlFor={text} className="flex min-h-full items-center justify-center w-20 bg-slate-50 rounded-md cursor-pointer border peer-checked:border-blue-500">{text}</label>
      </div>
		);
	}

  const RadioState = () => {
    return (
      <div className="flex max-h-[2rem] gap-2">
        <RadioStateButton text="online" handler={handleOnlineChange} state={'ONLINE'}/>
        <RadioStateButton text="offline" handler={handleOfflineChange} state={'OFFLINE'}/>
        <RadioStateButton text="in-game" handler={handleInGameChange} state={"INGAME"}/>
      </div>
    );
  }

  return {
    Obj: (
      <Form className="relative flex max-w-[23rem] flex-col items-center justify-center rounded-md p-4">
        <div>
          <input
            type="text"
            name="user search"
            placeholder="Search an user..."
            className="w-86 rounded-full py-2 pl-4 pr-4"
            onChange={handleInputChange}
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
          className="flex cursor-pointer items-center self-start pl-4 pr-5 pt-2 underline"
        >
          {"Filters"}
        </label>
        <IconDownChevron className="pointer-events-none h-4 translate-x-[-6rem] translate-y-[-1.22rem] px-1 transition peer-checked:rotate-90" />
        <div className="relative flex max-h-0 min-w-full flex-col overflow-y-auto px-5 peer-checked:max-h-20">
					<RadioState />
					<div className="flex items-center gap-1">
						friend with me
						<input type="checkbox" />
          </div>
          <div className="flex min-w-full gap-5">
            <p className="">elo rank range</p>
            <input type="range" className="absolute left-44 w-32" />
            <input type="range" className="absolute left-44 w-32" />
          </div>
        </div>
      </Form>
    ),
    Filter: Filter,
  };
};

export default function GlobalRanking() {
  const filter_menu = FilterMenu();
  return (
    <div className="flex max-h-screen flex-col items-center overflow-y-auto">
      <h1 className=" bg-gradient-to-tl from-green-700 to-sky-600 bg-clip-text p-10 text-center text-6xl font-bold text-transparent">
        Here be ranked <br /> the best <br /> of the best
      </h1>
      {/* this still needs to be implemented, but it should be possible with the query string on the get whoever want's to should give it a crack*/}
      {filter_menu.Obj}
      {/* also pagination should be added for the all users selector, something to get it working properly */}
      <AllUsers Filter={filter_menu.Filter} />
      {/* <PaginatedUsers /> */}
    </div>
  );
}
