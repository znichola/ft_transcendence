import { useParams } from "react-router-dom";
import { LoadingSpinnerMessage } from "../components/Loading";
import { useMutUserProfile, useUserData } from "../functions/customHook";
import { useAuth } from "./AuthProvider";
import { ErrorMessage } from "../components/ErrorComponents";
import BoxMenu, { ButtonGeneric } from "../components/BoxMenu";
import { useState } from "react";
import { UserData } from "../interfaces";
import { IconGear } from "../components/Icons";
import {
  InputField,
  InputFile,
  InputToggle,
  SubmitBTN,
} from "../components/FormComponents";
import { statusColor } from "../functions/utils";

export default function UserProfile() {
  // react states
  const [buttonState, setButtonState] = useState<string>("UNSET");

  // data fetching
  const { login42 } = useParams<"login42">();
  const cu = useAuth();
  const curretUser = cu?.user || "";
  const { data: profileUser, isLoading, isError } = useUserData(login42 || "");

  if (isLoading) return <LoadingSpinnerMessage message="loading profile" />;
  if (isError) return <ErrorMessage message="error laoding profile" />;
  return (
    <div className="relative flex h-full max-h-full min-h-0 w-full flex-grow-0 flex-col items-center">
      <BoxMenu
        resetBTN={() => setButtonState("UNSET")}
        heading={<UserProfileHeading user={profileUser} />}
      >
        <ButtonGeneric
          icon={IconGear}
          setBTNstate={setButtonState}
          buttonState={buttonState}
          checked="user-settings"
        >
          <CurrentUserSettings user={profileUser} />
        </ButtonGeneric>
      </BoxMenu>

      <div className="absolute bottom-0 left-0 h-[7%] w-full bg-gradient-to-t from-stone-50 to-transparent"></div>
    </div>
  );
}

function UserProfileHeading({ user }: { user: UserData }) {
  return (
    <div className="flex flex-row">
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
        <p className="text-left font-semibold">{"@" + user.login42}</p>
        <h1 className="bg-gradient-to-br from-fuchsia-600 to-orange-500 bg-clip-text text-center text-5xl font-semibold text-transparent">
          {user.name}
        </h1>
        <p className="pt-2">{user.bio}</p>
      </div>
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
      <hr className="my-4 h-px w-96 border-0 bg-slate-100" />
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
          onLable="Disable 2FA"
          offLable="Enable 2FA"
          value={tfa}
          onToggle={() => setTFA(tfa ? false : true)}
        />
        <div className="ml-6 flex-grow border-l-2 border-rose-400 pl-6 ">
          <p className="w-80 pb-3 text-slate-400">
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
