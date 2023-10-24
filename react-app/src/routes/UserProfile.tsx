import { useParams } from "react-router-dom";
import { LoadingSpinnerMessage } from "../components/Loading";
import {
  useMutUserAvatar,
  useMutUserProfile,
  useUserData,
  useUserFriends,
} from "../api/apiHooks";
import { useAuth } from "../functions/useAuth";
import { ErrorMessage } from "../components/ErrorComponents";
import BoxMenu, { ButtonGeneric } from "../components/BoxMenu";
import { useContext, useEffect, useRef, useState } from "react";
import { FriendData, UserData, UserFriends } from "../interfaces";
import { IconBolt, IconChatBubble, IconGear } from "../components/Icons";
import {
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
import { CodeInput } from "../components/CodeTFAinput";
import { patchTFACodeDisable, postTFACodeEnable } from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { NotificationContext } from "./NotificationProvider";

export default function UserProfile() {
  // react states
  const [buttonState, setButtonState] = useState<string>("UNSET");

  // data fetching
  const { login42 } = useParams<"login42">();
  const { user: currentUser } = useAuth();
  const {
    data: currentUserFriends,
    isLoading: isFriLoading,
    isError: isFriError,
  } = useUserFriends(currentUser);
  const { data: profileUser, isLoading, isError } = useUserData(login42);

  const [name, setName] = useState("");
  const [bio, setBio] = useState<string | undefined>(undefined);

  // profile elo, maybe this should be abstracted into a component
  // feels a bit messay having this code that's not related to the rest of the page

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
        heading={
          <UserProfileHeading
            user={profileUser}
            name={name || profileUser.name}
            bio={bio || profileUser.bio}
          />
        }
      >
        {currentUser === login42 ? (
          <ButtonGeneric
            icon={IconGear}
            setBTNstate={setButtonState}
            buttonState={buttonState}
            checked="user-settings"
          >
            <CurrentUserSettings
              user={profileUser}
              name={name}
              setName={setName}
              bio={bio}
              setBio={setBio}
            />
          </ButtonGeneric>
        ) : (
          <UserInteractions
            cardUser={profileUser}
            userFriends={currentUserFriends}
            currentUser={currentUser}
          />
        )}
      </BoxMenu>
      <div className="absolute bottom-0 left-0 h-[7%] w-full bg-gradient-to-t from-stone-50 to-transparent"></div>
      <div className="flex h-full w-full flex-col px-28 pt-64">
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

function UserProfileHeading({
  user,
  name,
  bio,
}: {
  user: UserData;
  name: string;
  bio: string | undefined;
}) {
  return (
    <div className="flex w-full flex-row pl-8 pt-6 lg:pl-24">
      <div
        className={
          "mr-6 border-r-4 pr-6 " + `border-${statusColor(user.status)}`
        }
      >
        <img
          className="aspect-square max-h-32 shadow"
          src={user.avatar}
          alt={user.login42 + " profile image"}
        />
      </div>
      <div className="">
        <PreHeading text={"@" + user.login42} />
        <h1 className="gradient-hightlight py-2 text-5xl font-bold ">{name}</h1>
        <p className="pt-2">{bio}</p>
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

function CurrentUserSettings({
  user,
  name,
  setName,
  bio,
  setBio,
}: IModifyForm) {
  // const [name, setName] = useState(user.name);
  // const [bio, setBio] = useState(user.bio);

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
      <button
        className="w-[32rem] px-12 text-end italic text-slate-400 underline hover:text-rose-500"
        onClick={() => {
          setName(user.name);
          setBio(user.bio);
        }}
      >
        reset
      </button>
      <ProfileModifyAvatar user={user} />
      <hr className="my-4 h-px w-96 border-0 bg-slate-100" />
      <ProfileModifyTFA />
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
  const mp = useMutUserProfile(user.login42);
  const msg = "remember to save changes";
  const { addNotif } = useContext(NotificationContext);

  return (
    <form
      className=" flex w-[32rem] flex-col gap-3 px-6"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submitted");
        mp.mutate(
          { name: name, bio: bio },
          {
            onSuccess: () =>
              addNotif({ type: "SUCCESS", message: "Profile modified" }),
          },
        );
      }}
    >
      <InputField
        value={name}
        lable="Display name"
        max={20}
        placeholder={user.name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <InputField
        value={bio || ""}
        lable="Bio"
        max={140}
        placeholder={user.bio || "I played pong back in the 70s."}
        onChange={(e) => setBio(e.currentTarget.value)}
      />
      <div className="flex text-slate-500 ">
        <p className="mr-6 flex-grow border-r-2 border-rose-400 pr-6 text-right">
          {msg}
        </p>
        <SubmitBTN />
      </div>
    </form>
  );
}

function ProfileModifyAvatar({ user }: { user: UserData }) {
  const [file, setFile] = useState<File>();
  const foo = useMutUserAvatar(user.login42);
  const { addNotif } = useContext(NotificationContext);
  // console.log("file:", file);
  return (
    <form
      className="flex w-[32rem] min-w-max flex-row items-end justify-center px-6"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submitted new image");
        if (file)
          foo.mutate(file, {
            onSuccess: () =>
              addNotif({ type: "SUCCESS", message: "Profile image modified" }),
          });
      }}
    >
      <div className="w-full">
        <InputFile
          handleFileChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          name="avatar-image"
          lable="Avatar image"
        />
      </div>
      <div className="ml-6 flex-grow border-l-2 border-rose-400 pl-6 ">
        <SubmitBTN lable="Upload" />
      </div>
    </form>
  );
}

function ProfileModifyTFA() {
  const { user, tfa, setFTA } = useAuth();
  const [activateTFA, setActivateTFA] = useState(tfa);
  const [openTFAwindow, setOpenTFAwindowp] = useState(false);

  function toggelTFA() {
    if (activateTFA) {
      setActivateTFA(false);
      patchTFACodeDisable(user);
      setFTA(false);
    } else {
      setOpenTFAwindowp(true);
    }
  }

  return (
    <div className="flex flex-row justify-center pb-10">
      <InputToggle
        onLable="2FA Enabled"
        offLable="2FA Disabled"
        value={activateTFA || openTFAwindow}
        onToggle={toggelTFA}
      />
      <div className="ml-4 flex-grow border-l-2 border-rose-400 pl-6 ">
        <p className="w-72 pb-3 text-slate-400">
          Once enabled, scan the code to link your google 2FA app.
        </p>
      </div>
      {openTFAwindow ? <SetupTFA isOpen={setOpenTFAwindowp} /> : <></>}
    </div>
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

function SetupTFA({ isOpen }: { isOpen: (b: boolean) => void }) {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { isLoading, isError, isSuccess } = useQuery({
    enabled: submitted,
    retry: false,
    queryFn: () => postTFACodeEnable(user, code),
  });
  const { addNotif } = useContext(NotificationContext);
  useEffect(() => {
    if (isError && submitted) {
      setSubmitted(false);
      setCode("");
    }
    if (isSuccess && submitted) {
      console.log("Two factor authentication was set up successfully");
      addNotif({ type: "SUCCESS", message: "TFA was setup sucessfully" });
    }
  }, [addNotif, isError, isSuccess, submitted]);

  return (
    <div className="box-theme absolute top-0 bg-stone-50 p-8">
      <QRcode />
      <hr className="my-4 h-px w-full border-0 bg-slate-100" />
      {isLoading && submitted ? (
        <div className="h-10 w-10 animate-spin rounded-full border-8 border-slate-700 border-b-transparent bg-stone-50" />
      ) : (
        <CodeInput
          code={code}
          setCode={setCode}
          error={isError}
          submit={() => setSubmitted(true)}
        />
      )}
      <button
        type="submit"
        onClick={() => isOpen(false)}
        className="px-12 text-end italic text-slate-400 underline hover:text-rose-500"
      >
        close
      </button>
    </div>
  );
}

function QRcode() {
  const { user } = useAuth();
  const qrcode = `${import.meta.env.VITE_SITE_URL}/api/tfa/${user}`;
  return (
    <>
      <img className="aspect-square w-full" src={qrcode} alt="qrcode" />
      <p className="pt-3 text-center ">
        Open the google
        <br />
        <b className="italic text-sky-400">authentication app</b>
        <br />
        and scan this QRcode
      </p>
    </>
  );
}
