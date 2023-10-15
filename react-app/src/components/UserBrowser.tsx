import { useState } from "react";
import BoxMenu, { ButtonGeneric } from "./BoxMenu";
import { IconFunnel } from "./Icons";
import {
  Heading,
  InputField,
  InputToggle,
  PreHeading,
  SubmitBTN,
} from "./FormComponents";

interface ISettings {
  isFriend: boolean;
  isOnline: boolean;
  isOffline: boolean;
  isInGame: boolean;
}

export default function UserBrowser({ title }: { title: string }) {
  // react states
  const [buttonState, setButtonState] = useState("UNSET");
  const [searchValue, setSearchValue] = useState("");
  const [settings, setSettings] = useState<ISettings>({
    isFriend: false,
    isOnline: false,
    isOffline: false,
    isInGame: false,
  });

  // const { data: users, isError, isLoading } =

  console.log("-------------");

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu heading={<HeadingFoo title={title} settings={settings} />}>
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
              <FilterSettings settings={settings} setSettings={setSettings} />
            </ButtonGeneric>
          </div>
        </div>
      </BoxMenu>
      {}
    </div>
  );
}

function HeadingFoo({ title, settings }: { title: string; settings: ISettings }) {
  return (
    <div>
      <PreHeading text={generateUserStatusMessage(settings)} />
      <Heading title={title} />
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

function FilterSettings({
  settings: s,
  setSettings,
}: {
  settings: ISettings;
  setSettings: (s: ISettings) => void;
}) {
  function toggleOffline() {
    if (!s.isOffline) {
      setSettings({
        ...s,
        isOffline: true,
        isOnline: false,
        isInGame: false,
      });
    } else setSettings({ ...s, isOffline: false });
  }

  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 py-8 shadow-xl">
      <InputToggle
        onLable="Friend"
        offLable="Friend"
        value={s.isFriend}
        onToggle={() =>
          setSettings({ ...s, isFriend: s.isFriend ? false : true })
        }
      />
      <InputToggle
        onLable="Online"
        offLable="Online"
        value={s.isOnline}
        onToggle={() =>
          setSettings({ ...s, isOnline: s.isOnline ? false : true })
        }
      />
      <InputToggle
        onLable="Offline"
        offLable="Offline"
        value={s.isOffline}
        onToggle={() => toggleOffline()}
      />
      <InputToggle
        onLable="In game"
        offLable="In game"
        value={s.isInGame}
        onToggle={() =>
          setSettings({ ...s, isInGame: s.isInGame ? false : true })
        }
      />
    </div>
  );
}

function generateUserStatusMessage(settings: ISettings) {
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
