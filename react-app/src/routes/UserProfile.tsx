import { useParams } from "react-router-dom";
import { LoadingSpinnerMessage } from "../components/Loading";
import {
  useMutUserProfile,
  useUserData,
  useUserFriends,
} from "../functions/customHook";
import { useAuth } from "../functions/useAuth";
import { ErrorMessage } from "../components/ErrorComponents";
import BoxMenu, { ButtonGeneric } from "../components/BoxMenu";
import { useEffect, useRef, useState } from "react";
import { FriendData, UserData, UserFriends } from "../interfaces";
import { IconBolt, IconChatBubble, IconGear } from "../components/Icons";
import {
  Heading,
  InputField,
  InputFile,
  InputToggle,
  PreHeading,
  SubmitBTN,
} from "../components/FormComponents";
import { statusColor } from "../functions/utils";
import { SideButton, SideButton2 } from "../components/UserInfoCard";
import RelationActions from "../components/UserInfoCardRelations";
import { MatchCell } from "../components/MatchCell";
import ProfileElo from "../components/ProfileElo";

export default function UserProfile() {
  // react states
  const [buttonState, setButtonState] = useState<string>("UNSET");

  // data fetching
  const { login42 } = useParams<"login42">();
  const cu = useAuth();
  const curretUser = cu?.user || "";
  const {
    data: curretUserFriends,
    isLoading: isFriLoading,
    isError: isFriError,
  } = useUserFriends(curretUser);
  const { data: profileUser, isLoading, isError } = useUserData(login42 || "");

  //EloRanking size update
  const [graphWidth, setGraphWidth] = useState(0);
  const elo_graph = useRef<HTMLDivElement>(null);

  function handleResize() {
    if (elo_graph.current) {
      setGraphWidth(elo_graph.current.offsetWidth * 2);
    }
  }

  useEffect(() => {
    handleResize();
  });

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading || isFriLoading)
    return <LoadingSpinnerMessage message="loading profile" />;
  if (isError || isFriError)
    return <ErrorMessage message="error laoding profile" />;
  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu
        resetBTN={() => setButtonState("UNSET")}
        heading={<UserProfileHeading user={profileUser} />}
      >
        {curretUser === login42 ? (
          <ButtonGeneric
            icon={IconGear}
            setBTNstate={setButtonState}
            buttonState={buttonState}
            checked="user-settings"
          >
            <CurrentUserSettings user={profileUser} />
          </ButtonGeneric>
        ) : (
          <UserInteractions
            cardUser={profileUser}
            userFriends={curretUserFriends}
            currentUser={curretUser}
          />
        )}
      </BoxMenu>
      <div className="absolute bottom-0 left-0 h-[7%] w-full bg-gradient-to-t from-stone-50 to-transparent"></div>
      <div className="flex flex-col w-full h-full px-28 pt-64">
        <div className="flex max-h-72 w-full grow items-center py-4">
          <div
            ref={elo_graph}
            className="flex min-h-fit min-w-fit rounded-xl border-b-2 border-stone-300 bg-stone-50 p-4 shadow"
          >
            <ProfileElo
              data={profileUser.eloHistory}
              w={graphWidth}
              lineWidth={7}
              fontSize="text-3xl"
              className="h-40 max-h-[10rem]"
            />
          </div>
        </div>
        <div className="flex h-fit w-full gap-5 overflow-x-scroll pb-7 pl-1">
          <MatchCell victory={true} />
          <MatchCell victory={false} />
          <MatchCell victory={true} />
          <MatchCell victory={false} />
          <MatchCell victory={true} />
          <MatchCell victory={false} />
        </div>
      </div>
    </div>
  );
}

function UserProfileHeading({ user }: { user: UserData }) {
  return (
    <div className="flex w-full flex-row pl-24 pt-8">
      <div
        className={
          "mr-6 h-32 border-r-4 pr-6 " + `border-${statusColor(user.status)}`
        }
      >
        <img
          className="h-32 shadow"
          src={user.avatar}
          alt={user.login42 + " profile image"}
        />
      </div>
      <div className="">
        <PreHeading text={"@" + user.login42} />
        <Heading title={user.name} />
        <p className="pt-2">{user.bio}</p>
      </div>
    </div>
  );
}

function UserInteractions({
  cardUser,
  userFriends,
  currentUser,
}: {
  cardUser: UserData;
  userFriends: UserFriends;
  currentUser: string;
}) {
  const ff = (f: FriendData) => f.login42 == cardUser.login42;
  const relationStatus = userFriends.friends.find(ff)
    ? "friends"
    : userFriends.pending.find(ff)
    ? "sent"
    : userFriends.requests.find(ff)
    ? "pending"
    : "none";
  return (
    <div className="flex h-12 gap-12 py-2 ">
      <SideButton2
        message={"Play pong"}
        a1={"classical"}
        a2={"special"}
        to1={`/pong/${currentUser}/vs/${cardUser.login42}/classical`}
        to2={`/pong/${currentUser}/vs/${cardUser.login42}/special`}
        icon={IconBolt}
      />
      <SideButton
        message={"Private chat"}
        action={"message"}
        to={"/message/" + cardUser.login42}
        icon={IconChatBubble}
      />
      <RelationActions
        currentUser={currentUser}
        cardUser={cardUser.login42}
        status={relationStatus}
      />
    </div>
  );
}

function CurrentUserSettings({ user }: { user: UserData }) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [tfa, setTFA] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white p-3 pt-4 shadow-xl ">
      <IntroDescription />
      <ProfileModifyForm
        name={name}
        bio={bio}
        setName={setName}
        setBio={setBio}
        user={user}
      />
      <form
        className="flex w-[32rem] min-w-max flex-row items-end justify-center px-6"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("submitted new image");
        }}
      >
        <div className="w-full">
          <InputFile name="avatar-image" lable="Avatar image" />
        </div>
        <div className="ml-6 flex-grow border-l-2 border-rose-400 pl-6 ">
          <SubmitBTN lable="Upload" />
        </div>
      </form>
      <hr className="my-4 h-px w-96 border-0 bg-slate-100" />
      <div className="flex flex-row justify-center pb-10">
        <InputToggle
          onLable="2FA Enabled"
          offLable="2FA Disabled"
          value={tfa}
          onToggle={() => setTFA(tfa ? false : true)}
        />
        <div className="ml-4 flex-grow border-l-2 border-rose-400 pl-6 ">
          <p className="w-72 pb-3 text-slate-400">
            Once enabled, scan the code to link your google 2FA app.
          </p>
        </div>
      </div>
    </div>
  );
}

interface IModifyForm {
  user: UserData;
  name: string;
  bio: string | undefined;
  setName: (s: string) => void;
  setBio: (s: string | undefined) => void;
}

function ProfileModifyForm({ user, name, bio, setName, setBio }: IModifyForm) {
  const modifyProfile = useMutUserProfile(user.login42);

  return (
    <form
      className=" flex w-[32rem] flex-col gap-3 px-6"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submitted");
      }}
    >
      <InputField
        value={name}
        lable="Display name"
        max={20}
        placeholder={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <InputField
        value={bio || ""}
        lable="Bio"
        max={140}
        placeholder={bio || "I played pong back in the 70s."}
        onChange={(e) => setBio(e.currentTarget.value)}
      />
      <div className="flex text-slate-500 ">
        <p className="mr-6 flex-grow border-r-2 border-rose-400 pr-6 text-right">
          TODO: add error message for post
        </p>
        <SubmitBTN />
      </div>
    </form>
  );
}

function IntroDescription() {
  return (
    <div className=" max-w-lg pb-3 text-slate-400">
      Change your profle settings but please <br /> be respectful of other
      players and our{" "}
      <a
        className="text-sky-400"
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      >
        T&C
      </a>
      .
    </div>
  );
}
