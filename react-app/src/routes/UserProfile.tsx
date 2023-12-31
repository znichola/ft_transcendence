import { useParams, useSearchParams } from "react-router-dom";
import { LoadingSpinner, LoadingSpinnerMessage } from "../components/Loading";
import {
  useMutBlockUser,
  useMutUnblockUser,
  useMutUserAvatar,
  useMutUserProfile,
  useUserBlocked,
  useUserData,
  useUserFriends,
  useUserMatchHistory,
} from "../api/apiHooks";
import { useAuth, useNotification } from "../functions/contexts";
import { ErrorMessage } from "../components/ErrorComponents";
import BoxMenu, { ButtonGeneric } from "../components/BoxMenu";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { RelationData, UserData } from "../interfaces";
import {
  IconBolt,
  IconChatBubble,
  IconGear,
  IconStop,
  IconTrophy,
} from "../components/Icons";
import {
  InputField,
  InputFile,
  InputToggle,
  PreHeading,
  SubmitBTN,
} from "../components/FormComponents";
import { br_statusColor } from "../functions/utils";
import { SideButton, SideButton2 } from "../components/UserInfoCard";
import RelationActions, { FB1 } from "../components/UserInfoCardRelations";
import { MatchCell } from "../components/MatchCell";
import ProfileElo from "../components/ProfileElo";
import { CodeInput } from "../components/CodeTFAinput";
import { patchTFACodeDisable, postTFACodeEnable } from "../api/axios";
import { useMutation } from "@tanstack/react-query";
import { userSocket } from "../socket";

export default function UserProfile() {
  // data fetching
  const [searchParams] = useSearchParams();
  const { login42 } = useParams<"login42">();
  const { data: currentUser, isLoading, isError } = useUserData(login42);
  const [buttonState, setButtonState] = useState<string>(
    searchParams.get("first") == "true" ? "user-settings" : "UNSET",
  );

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

  if (isError || !login42)
    return <ErrorMessage message="This user does not exist" />;
  if (isLoading) return <LoadingSpinnerMessage message="loading profile" />;

  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center overflow-y-auto">
      <BoxMenu
        resetBTN={() => setButtonState("UNSET")}
        heading={
          <UserProfileHeading
            user={currentUser}
            setButtonState={setButtonState}
            buttonState={buttonState}
          />
        }
        noGradient={true}
      ></BoxMenu>
      <div className="flex h-full w-full flex-col px-3 pt-64 lg:px-28">
        <div className="flex max-h-72 w-full grow items-center py-4">
          <div
            ref={elo_graph}
            className="relative flex min-h-fit min-w-fit flex-col rounded-xl border-b-2 border-stone-300 bg-stone-50 p-4 shadow"
          >
            <h2 className="-mb-5 text-lg font-semibold">Elo graph</h2>
            <ProfileElo
              data={currentUser.eloHistory}
              w={graphWidth}
              lineWidth={7}
              fontSize="text-3xl"
              className="h-40 max-h-[10rem]"
            />
            <div className="absolute bottom-2 top-auto flex h-fit w-full">
              <p className="grow text-center font-bold text-green-400">
                {"Wins: " + currentUser.wins.toString()}
              </p>
              <p className="grow text-center font-bold text-red-300">
                {"Losses: " + currentUser.losses.toString()}
              </p>
            </div>
          </div>
        </div>
        <UserMatchHistory login42={login42} />
      </div>
    </div>
  );
}

function UserMatchHistory({ login42 }: { login42: string }) {
  const {
    data: matchHistory,
    isLoading,
    isError,
  } = useUserMatchHistory(login42);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <ErrorMessage message="Error when loading match history !" />;
  }

  return (
    <div className="flex w-full flex-col items-center rounded-xl bg-stone-50 px-1 pb-20 shadow-md">
      <h2 className="self-start p-5 text-lg font-semibold">Match history</h2>
      <div
        className="flex w-full flex-wrap justify-center gap-5 overflow-y-auto overflow-x-hidden px-5"
        style={{ gridTemplateAreas: "auto-fill", gridRow: "auto-fill" }}
      >
        {matchHistory.map(
          (gameData) =>
            gameData.gameState != null ? (
              <MatchCell
                key={gameData.gameState.id}
                gameData={gameData}
                profile_user={login42}
              />
            ) : (
              <></>
            ), //TODO : MatchCell sould be always displayable
        )}
      </div>
    </div>
  );
}

function UserProfileHeading({
  user,
  buttonState,
  setButtonState,
}: {
  user: UserData;
  buttonState: string;
  setButtonState: (value: SetStateAction<string>) => void;
}) {
  const { user: currentUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState<string | undefined>(user.bio);

  useEffect(() => {
    setName(user.name);
    setBio(user.bio);
  }, [user]);

  return (
    <div className="flex w-full flex-row gap-5 pl-8 pt-6 lg:pl-16">
      <div className={"mr-6 border-r-4 pr-6 " + br_statusColor(user.status)}>
        <img
          className="aspect-square h-24 min-h-[6rem] w-24 min-w-[6rem] rounded-xl shadow sm:min-h-[8rem] sm:min-w-[8rem]"
          src={user.avatar}
          alt={user.login42 + " profile image"}
        />
        <div className="flex grow items-center justify-center pt-2 text-3xl font-bold">
          {user.elo} <IconTrophy className="h-7 w-7" />
        </div>
      </div>
      <div className="flex flex-col overflow-hidden">
        <PreHeading text={"@" + user.login42} />
        <h1 className="gradient-hightlight min-w-0 overflow-hidden break-words py-2 text-4xl font-bold md:text-5xl">
          {name}
        </h1>
        <p className="flex grow items-center">{bio}</p>
      </div>
      {currentUser === user.login42 ? (
        <div className="flex min-w-0 grow items-end justify-end px-2 md:px-4">
          <ButtonGeneric
            icon={IconGear}
            setBTNstate={setButtonState}
            buttonState={buttonState}
            checked="user-settings"
          >
            <CurrentUserSettings
              user={user}
              name={name}
              setName={setName}
              bio={bio}
              setBio={setBio}
            />
          </ButtonGeneric>
        </div>
      ) : (
        <UserInteractions user={user} currentUser={currentUser} />
      )}
    </div>
  );
}

function BlockSideButton({
  user,
  currentUser,
}: {
  user: string;
  currentUser: string;
}) {
  const {
    data: blockedUsers,
    isLoading,
    isError,
  } = useUserBlocked(currentUser);
  const blockUser = useMutBlockUser(currentUser, user);
  const unblockUser = useMutUnblockUser(currentUser, user);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <ErrorMessage message="Error: failed to load blocked users" />;
  }

  const isBlocked = !!blockedUsers.find((u) => u == user);

  return (
    <div className="group relative flex w-12 flex-1 items-center justify-end ">
      <div
        className={
          "absolute h-full grow p-1 pr-2 duration-300 " +
          (isBlocked ? "text-red-500" : "text-stone-300")
        }
      >
        {<IconStop strokeWidth={2} />}
      </div>
      <div className="duration-400 group-hover:order-slate-100 absolute flex h-full w-0 items-center justify-center overflow-hidden rounded-l-xl bg-white transition-all group-hover:w-max group-hover:border group-hover:p-2">
        <div className="text-xs font-semibold text-slate-500">
          <FB1
            message={"Manage block"}
            a1={isBlocked ? "unblock" : "block"}
            a1btn={
              isBlocked
                ? () => {
                    unblockUser.mutate();
                  }
                : () => {
                    blockUser.mutate();
                  }
            }
          />
        </div>
      </div>
    </div>
  );
}

function UserInteractions({
  user,
  currentUser,
}: {
  user: UserData;
  currentUser: string;
}) {
  const { data: userFriends, isLoading, isError } = useUserFriends(currentUser);

  if (isLoading) return <LoadingSpinnerMessage message="Loading friends..." />;
  if (isError) return <ErrorMessage message="error laoding profile" />;

  const ff = (f: RelationData) => f.login42 == user.login42;
  const relationStatus = userFriends.friends.find(ff)
    ? "friends"
    : userFriends.pending.find(ff)
    ? "sent"
    : userFriends.requests.find(ff)
    ? "pending"
    : "none";
  return (
    <div className="flex grow flex-col items-end py-2">
      <SideButton2
        message={"Play pong"}
        a1={"classical"}
        a2={"special"}
        to1={`/play/classical?challenge=true`}
        onClick1={() => {
          //console.log("Challenge to classical");
          userSocket.emit("challenge", {
            invitedLogin: user.login42,
            special: false,
          });
        }}
        to2={`/play/special?challenge=true`}
        onClick2={() => {
          //console.log("Challenge to special");
          userSocket.emit("challenge", {
            invitedLogin: user.login42,
            special: true,
          });
        }}
        icon={IconBolt}
      />
      <SideButton
        message={"Private chat"}
        action={"message"}
        to={"/message/" + user.login42}
        icon={IconChatBubble}
      />
      <RelationActions
        currentUser={currentUser}
        cardUser={user.login42}
        status={relationStatus}
      />
      <BlockSideButton user={user.login42} currentUser={currentUser} />
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
    <div className="relative">
      <div className="absolute flex w-full min-w-0 flex-col items-center justify-center gap-2 rounded-lg border-b-4 border-stone-200 bg-white pt-4 shadow-xl">
        <IntroDescription />
        <ProfileModifyForm
          name={name}
          bio={bio}
          setName={setName}
          setBio={setBio}
          user={user}
        />
        <ProfileModifyAvatar user={user} />
        <hr className="my-4 h-px w-96 border-0 bg-slate-100" />
        <ProfileModifyTFA />
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
  const mp = useMutUserProfile(user.login42);
  const msg = "remember to save changes";
  const { addNotif } = useNotification();

  return (
    <form
      className=" flex w-full max-w-lg flex-col gap-3 px-6"
      onSubmit={(e) => {
        e.preventDefault();
        //console.log("submitted");
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
  const { addNotif } = useNotification();
  // console.log("file:", file);
  return (
    <form
      className="flex w-full max-w-lg flex-row items-end justify-center px-6"
      onSubmit={(e) => {
        e.preventDefault();
        //console.log("submitted new image");
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
  const [openTFAwindow, setOpenTFAwindow] = useState(false);
  const selfRef = useRef<HTMLDivElement>(null);

  function toggelTFA() {
    if (openTFAwindow || activateTFA) {
      setActivateTFA(false);
      patchTFACodeDisable(user);
      setFTA(false);
      setOpenTFAwindow(false);
    } else {
      setOpenTFAwindow(true);
    }
  }

  return (
    <div ref={selfRef} className="flex flex-row justify-center p-4">
      <div className="">
        <InputToggle
          onLable="2FA Enabled"
          offLable="2FA Disabled"
          value={activateTFA || openTFAwindow}
          onToggle={toggelTFA}
        />
      </div>
      <div className="ml-4 flex-grow border-l-2 border-rose-400 pl-6 ">
        <p className="w-full break-words pb-3 text-slate-400">
          Once enabled, scan the code to link your google 2FA app.
        </p>
      </div>
      {openTFAwindow && !activateTFA ? (
        <SetupTFA isOpen={setOpenTFAwindow} setActivateTFA={setActivateTFA} />
      ) : (
        <></>
      )}
    </div>
  );
}

function IntroDescription() {
  return (
    <div className=" max-w-lg pb-3 text-slate-400">
      Change your profile settings but please <br /> be respectful of other
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

function SetupTFA({
  isOpen,
  setActivateTFA,
}: {
  isOpen: (b: boolean) => void;
  setActivateTFA: (b: boolean) => void;
}) {
  const { user, setFTA } = useAuth();
  const [code, setCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const changeTFA = useMutation({
    mutationFn: ({ user, code }: { user: string; code: string }) =>
      postTFACodeEnable(user, code),
    onSuccess: () => {
      addNotif({ type: "SUCCESS", message: "TFA was setup sucessfully" });
      setFTA(true);
      setSubmitted(false);
      setActivateTFA(true);
    },
    onError: () => {
      setCode("");
      setSubmitted(false);
    },
  });
  const { addNotif } = useNotification();

  return (
    <div className="box-theme absolute top-0 overflow-y-scroll bg-stone-50 p-8">
      <QRcode />
      <hr className="my-4 h-px w-full border-0 bg-slate-100" />
      {submitted ? (
        <div className="h-10 w-10 animate-spin rounded-full border-8 border-slate-700 border-b-transparent bg-stone-50" />
      ) : (
        <CodeInput
          code={code}
          setCode={setCode}
          submit={() => {
            setSubmitted(true);
            changeTFA.mutate({ user: user, code: code });
          }}
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
