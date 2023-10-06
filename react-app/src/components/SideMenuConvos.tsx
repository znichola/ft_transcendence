import { UserData } from "../interfaces";
import { useUserConverstaions } from "../functions/customHook";
import { LoadingSpinnerMessage } from "./Loading";
import { ErrorMessage } from "./ErrorComponents";
import { Nav } from "./SideMenu";
import { UserIcon } from "./UserIcon";

export default function NavConvos({ currentUser }: { currentUser: UserData }) {
  const {
    data: convos,
    isLoading,
    isError,
  } = useUserConverstaions(currentUser.login42);
  if (isLoading) return <LoadingSpinnerMessage message="Loading messages..." />;
  if (isError) return <ErrorMessage message="Error loading message history" />;
  return (
    <>
      {convos.map((c) => {
        const target =
          currentUser.login42 === c.user1Login42
            ? c.user2Login42
            : c.user1Login42;
        return (
          <Nav
            key={c.id}
            name={target}
            to={"/message/" + target}
            icon={() => <UserIcon user={target} />}
          />
        );
      })}
    </>
  );
}
