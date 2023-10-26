import { SetStateAction, useRef, useState } from "react";
import BoxMenu, { ButtonGeneric } from "./BoxMenu";
import { IconFunnel } from "./Icons";
import {
  Heading,
  InputField,
  InputToggle,
  PreHeading,
  SubmitBTN,
} from "./FormComponents";
import { authApi } from "../api/axios";
import { IUsersAll, UserFriends } from "../interfaces";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useUserData, useUserFriends } from "../api/apiHooks";
import { useAuth } from "../functions/contexts";
import { LoadingSpinner, LoadingSpinnerMessage } from "./Loading";
import { ErrorMessage } from "./ErrorComponents";
import { useIntersection } from "../functions/uneIntersection";
import UserInfoCard from "./UserInfoCard";

interface ISettings {
  isFriend: boolean;
  isOnline: boolean;
  isOffline: boolean;
  isInGame: boolean;
}

export function SearchComponent({
  searchValue,
  setSearchValue,
  buttonState,
  setButtonState,
  largeYTranslate = false,
  children,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  buttonState: string;
  setButtonState: (value: SetStateAction<string>) => void;
  yTranslation?: string;
  largeYTranslate?: boolean;
  children?: JSX.Element[] | JSX.Element;
}) {
  return (
    <div className="flex items-end pb-8 pr-6">
      <Searchbar value={searchValue} setValue={setSearchValue} />
      <ButtonGeneric
        icon={IconFunnel}
        setBTNstate={setButtonState}
        buttonState={buttonState}
        checked="filter-settings"
        filledIn={true}
        largeYTranslate={largeYTranslate}
      >
        {children}
      </ButtonGeneric>
    </div>
  );
}

export default function UserBrowser({ title }: { title: string }) {
  // open/close menu state
  const [buttonState, setButtonState] = useState("UNSET");

  // search states
  const [searchValue, setSearchValue] = useState("");
  const [settings, setSettings] = useState<ISettings>({
    isFriend: false,
    isOnline: false,
    isOffline: false,
    isInGame: false,
  });

  const searchParams: IUsersAll = {
    status: findStatus(settings),
    name: searchValue != "" ? searchValue : undefined,
  };

  // api calls
  const { user: currentUser } = useAuth();
  const {
    data: relations,
    isLoading: isFriLoading,
    isError: isFriError,
  } = useUserFriends(currentUser);

  // infinate scroll TODO: not implemented to scroll
  const fetchPage = async ({ pageParam = 1 }) =>
    authApi
      .get<string[]>("/user/", { params: { ...searchParams, page: pageParam } })
      .then((res) => res.data);
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["UserListInfinateScroll", searchParams],
    queryFn: fetchPage,
    getNextPageParam: (_, pages) => pages.length + 1,
    staleTime: 5 * (60 * 1000), // 5 mins
    cacheTime: 10 * (60 * 1000), // 10 mins
  });
  const ref = useRef(null);
  const inViewport = useIntersection(ref, "0px");

  if (isFriLoading)
    return <LoadingSpinnerMessage message="fetching friends ..." />;
  if (isFriError) return <ErrorMessage message="error fetching friends" />;
  // if (isFetchingNextPage) TODO : Poffiner si on a le temps un jour
  //   return <LoadingSpinnerMessage message="fetching pages ..." />;
  // if (status !== "success") return <ErrorMessage message="Error fetching pages" />;

  const _posts = data?.pages.flatMap((p) => p);

  if (
    inViewport &&
    _posts &&
    _posts.length > 5 &&
    (data?.pages[data?.pageParams.length - 1].length ?? 0) > 0
  ) {
    // console.log("posts len", _posts.length);
    fetchNextPage();
  }

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center ">
      <BoxMenu
        resetBTN={() => setButtonState("UNSET")}
        heading={<HeadingFoo title={title} settings={settings} />}
      >
        <div className="flex flex-col">
          <hr className="my-4 h-px w-96 border-0 bg-slate-100" />
          <SearchComponent
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            buttonState={buttonState}
            setButtonState={setButtonState}
          >
            <FilterSettings settings={settings} setSettings={setSettings} />
          </SearchComponent>
        </div>
      </BoxMenu>
      <div className="flex w-full flex-col items-center overflow-scroll">
        <div
          className={
            "transition-all duration-500 " +
            (buttonState != "UNSET" ? "min-h-[26rem]" : "min-h-[20rem]")
          }
        />
        {_posts?.map((u) => (
          <FilterInfoCard
            key={u}
            cardLogin42={u}
            settings={settings}
            currentLogin42={currentUser}
            userRelations={relations}
            searchValue={searchValue}
          />
        ))}
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? (
            <LoadingSpinner />
          ) : (data?.pages[data?.pageParams.length - 1].length ?? 0) > 0 ? (
            "Load more?"
          ) : (
            "Nothing more to load"
          )}
        </button>
      </div>
    </div>
  );
}

interface IFilterInfoCard {
  cardLogin42: string;
  currentLogin42: string;
  userRelations: UserFriends;
  settings: ISettings;
  searchValue: string;
}

function FilterInfoCard({
  // settings,
  cardLogin42,
  currentLogin42,
  userRelations, // searchValue,
}: IFilterInfoCard) {
  const { data: cu, isLoading, isError } = useUserData(cardLogin42);

  if (isLoading) return <LoadingSpinnerMessage message="loading profile ..." />;
  if (isError) return <ErrorMessage message="Error loading profile" />;
  // if (
  //   cu.status !== findStatus(settings) ||
  //   (searchValue !== "" &&
  //     (cu.login42.toLowerCase().includes(searchValue) ||
  //       cu.name.toLowerCase().includes(searchValue)))
  // ) {
  //   return <></>;
  // }
  return (
    <UserInfoCard
      cardUser={cu}
      currentUser={currentLogin42}
      userFriends={userRelations}
      key={cardLogin42}
    />
  );
}

function HeadingFoo({
  title,
  settings,
}: {
  title: string;
  settings: ISettings;
}) {
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
      className="flex w-[28rem] min-w-max flex-row items-end justify-center px-6"
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
      <div className="h-10 flex-grow border-r-2 border-stone-200 pl-6"/>
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
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 py-8 shadow-xl">
      <InputToggle
        onLable="Friend"
        offLable="Friend"
        value={s.isFriend}
        onToggle={() => setSettings({ ...s, isFriend: !s.isFriend })}
      />
      <InputToggle
        onLable="Online"
        offLable="Online"
        value={s.isOnline}
        onToggle={() =>
          setSettings({
            ...s,
            isOnline: !s.isOnline,
            isOffline: false,
            isInGame: false,
          })
        }
      />
      <InputToggle
        onLable="Offline"
        offLable="Offline"
        value={s.isOffline}
        onToggle={() =>
          setSettings({
            ...s,
            isOffline: !s.isOffline,
            isOnline: false,
            isInGame: false,
          })
        }
      />
      <InputToggle
        onLable="In game"
        offLable="In game"
        value={s.isInGame}
        onToggle={() =>
          setSettings({
            ...s,
            isInGame: !s.isInGame,
            isOffline: false,
            isOnline: false,
          })
        }
      />
    </div>
  );
}

function findStatus(settings: ISettings) {
  if (settings.isOnline) return "ONLINE";
  if (settings.isOffline) return "OFFLINE";
  if (settings.isInGame) return "INGAME";
  return undefined;
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
