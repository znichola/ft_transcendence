import { useState } from "react";
import BoxMenu, { ButtonGeneric } from "./BoxMenu";
import { IconFunnel } from "./Icons";
import { InputField, InputToggle, SubmitBTN } from "./FormComponents";

export default function UserBrowser({ title }: { title: string }) {
  // react states
  const [buttonState, setButtonState] = useState("UNSET");
  const [searchValue, setSearchValue] = useState("");
  const [isFriend, setFriends] = useState(false);
  const [isOnline, setOnline] = useState(false);
  const [isInGame, setInGame] = useState(false);
  const [isOffline, setOffline] = useState(false);

  const settings = {
    isFriend,
    isOnline,
    isOffline,
    isInGame,
  };

  console.log("-------------");

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu heading={<Heading title={title} settings={settings} />}>
        <div className="flex flex-col">
          <hr className="my-4 h-px w-96 border-0 bg-slate-100" />
          <div className="flex items-end pb-8 pr-6">
            <Searchbar value={searchValue} setValue={setSearchValue} />
            <ButtonGeneric
              icon={IconFunnel}
              setBTNstate={setButtonState}
              buttonState={buttonState}
              checked="filter-settings"
              filledIn={true}
            >
              <FilterSettings
                isFriend={isFriend}
                toggleIsFriend={() => setFriends(isFriend ? false : true)}
                isOnline={isOnline}
                toggleIsOnline={() => setOnline(isOnline ? false : true)}
                isOffline={isOffline}
                toggleIsOffline={() => setOffline(isOffline ? false : true)}
                isInGame={isInGame}
                toggleIsInGame={() => setInGame(isInGame ? false : true)}
              />
            </ButtonGeneric>
          </div>
        </div>
      </BoxMenu>
      ;
    </div>
  );
}

function Heading({
  title,
  settings,
}: {
  title: string;
  settings: IFilterSettings;
}) {
  return (
    <div>
      <p className="text-left font-semibold">
        {generateUserStatusMessage(settings)}{" "}
      </p>
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
      <div className="ml-6 flex-grow border-l-2 border-stone-200 pl-6 ">
        <SubmitBTN lable="Search" />
      </div>
    </form>
  );
}

interface IFilterSettings {
  isFriend: boolean;
  toggleIsFriend: () => void;
  isOnline: boolean;
  toggleIsOnline: () => void;
  isOffline: boolean;
  toggleIsOffline: () => void;
  isInGame: boolean;
  toggleIsInGame: () => void;
}

function FilterSettings({
  isFriend,
  toggleIsFriend,
  isOnline,
  toggleIsOnline,
  isOffline,
  toggleIsOffline,
  isInGame,
  toggleIsInGame,
}: IFilterSettings) {

  // if (isOffline) {
    if (isOnline) toggleIsOnline();
    if (isInGame) toggleIsInGame();
  // }

  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 py-8 shadow-xl">
      <InputToggle
        onLable="Friend"
        offLable="Friend"
        value={isFriend}
        onToggle={toggleIsFriend}
      />
      <InputToggle
        onLable="Online"
        offLable="Online"
        value={isOnline}
        onToggle={toggleIsOnline}
      />
      <InputToggle
        onLable="Offline"
        offLable="Offline"
        value={isOffline}
        onToggle={toggleIsOffline}
      />
      <InputToggle
        onLable="In game"
        offLable="In game"
        value={isInGame}
        onToggle={toggleIsInGame}
      />
    </div>
  );
}

function generateUserStatusMessage(settings: IFilterSettings): string {
  const statusPhrases = [];

  if (settings.isOnline) {
    statusPhrases.push("Online");
  }
  if (settings.isOffline) {
    statusPhrases.push("Offline");
  }
  if (settings.isFriend) {
    statusPhrases.push("your Fiends");
  }
  if (settings.isInGame) {
    statusPhrases.push("In-Game");
  }

  if (statusPhrases.length === 0) {
    return "Showing all users";
  }

  if (statusPhrases.length > 1) {
    const lastStatus = statusPhrases.pop();
    const otherStatuses = statusPhrases.join(", ");
    return `Showing users that are ${otherStatuses}, and ${lastStatus}`;
  }

  return `Showing users that are ${statusPhrases[0]}`;
}
