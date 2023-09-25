import { UserData } from "../interfaces";
import Avatar from "./Avatar";
import { Nav } from "./SideMenu.tsx";

// Temporaire pour le user
import { getCurrentUser } from "../Api-axios.tsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function statusColor(status: UserData["status"]) {
  switch (status) {
    case "ONLINE":
      return "ring-green-600";
    case "OFFLINE":
      return "ring-gray-300";
    case "INGAME":
      return "ring-blue-400";
    case "UNAVAILABLE":
      return "ring-red-500";
    default:
      return "ring-ping-700";
  }
}

function Message({sender, text, tmp}:{sender: UserData, text: string}){
  return (
    <div className="shadow-md bg-white rounded-xl p-3">
      <div className={`${tmp == 1 ? "float-right" : "float-left"} inline-block px-5`}>
        <img
          className={
            "h-20 w-20 rounded-full ring-2 min-h-[5rem]" + " " + statusColor(sender.status)
          }
          src={sender.avatar}
          alt={sender.login42 || "undefined" + " profile image"}
        />
      </div>
        <div className={`grow order-${tmp * 0} ${tmp == 1 ? "text-right" : ""} break-words pt-6 px-3 min-w-0`}>
          {text}
        </div>
    </div>
  );
}

// Image en dehors des messages et glisses quand overflow

export default function ChatMessages() {

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    initialData: "default42",
  });

  const {
    data: currentUserData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["UserData", user],
    queryFn: () => axios.get<UserData>("/user/" + user).then((res) => res.data),
  });

  return(
    <div className="flex flex-col-reverse w-full h-full text-slate-800 overflow-auto p-3 px-10 gap-4 text lg:text-xl font-light bg-stone-100">
      <Message sender={currentUserData} text={"Je suis le message 1"} tmp={0}/>
      <Message sender={currentUserData} text={"Je suis le message 2"} tmp={1}/>
      <Message sender={currentUserData} text={"Je suis le message 3"} tmp={0}/>
      <Message sender={currentUserData} text={"Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker."} tmp={1}/>
      <Message sender={currentUserData} text={"Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker."} tmp={0}/>
      <Message sender={currentUserData} text={"Je suis le message 5"} tmp={0}/>
      <Message sender={currentUserData} text={"Je suis le message 6"} tmp={1}/>
      <Message sender={currentUserData} text={"Je suis le message 7"} tmp={0}/>
      <Message sender={currentUserData} text={"Je suis le message 8"} tmp={1}/>
      <Message sender={currentUserData} text={"Je suis le message 9"} tmp={0}/>
      <Message sender={currentUserData} text={"Je suis le message 10"} tmp={1}/>
      <Message sender={currentUserData} text={"Je suis le message 11"} tmp={0}/>
      <Message sender={currentUserData} text={"Je suis le message 12"} tmp={1}/>
      <Message sender={currentUserData} text={"Je suis le message 13"} tmp={0}/>
      <Message sender={currentUserData} text={"Je suis le message 14"} tmp={1}/>
    </div>
  );
}