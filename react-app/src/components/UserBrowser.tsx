import { useState } from "react";
import BoxMenu, { ButtonGeneric } from "./BoxMenu";
import { IconGear } from "./Icons";
import { InputField, InputToggle, SubmitBTN } from "./FormComponents";

export default function UserBrowser({ title }: { title: string }) {
  // react states
  const [buttonState, setButtonState] = useState("UNSET");
  const [searchValue, setSearchValue] = useState("");
  const [isFriend, setIsFriends] = useState(false);
  const [isOnline, setOnline] = useState(false);
  const [isInGame, setInGame] = useState(false);
  const [isOffline, setOffline] = useState(false);


  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu heading={<Heading title={title} />}>
        <div className="flex flex-col">
          <hr className="my-4 h-px w-96 border-0 bg-slate-100" />
          <div className="flex items-end pb-8">
            <Searchbar value={searchValue} setValue={setSearchValue} />
            <ButtonGeneric
              icon={IconGear}
              setBTNstate={setButtonState}
              buttonState={buttonState}
              checked="filter-settings"
            >
              <FilterSettings />
            </ButtonGeneric>
          </div>
        </div>
      </BoxMenu>
      ;
    </div>
  );
}

function Heading({ title }: { title: string }) {
  return (
    <div>
      <p className="text-left font-semibold">{"user browser"} </p>
      <h1 className="bg-gradient-to-br from-fuchsia-600 to-orange-500 bg-clip-text text-center text-5xl font-semibold text-transparent">
        {title}
      </h1>
    </div>
  );
}

interface ISearchbar {
  value: string;
  setValue: (s: string) => void;
}

function Searchbar({ value, setValue }: ISearchbar) {
  return (
    <form
      className="flex w-[32rem] min-w-max flex-row items-end justify-center px-6"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submitted new image");
      }}
    >
      <div className="w-full">
        <InputField
          value={value}
          lable=""
          max={40}
          placeholder={""}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </div>
      <div className="ml-6 flex-grow border-l-2 border-rose-400 pl-6 ">
        <SubmitBTN lable="Search" />
      </div>
    </form>
  );
}

function FilterSettings() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
      <InputToggle onLable="is online" offLable=""/>
    </div>
  );
}
