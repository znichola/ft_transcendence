import { useEffect, useState } from "react";
import { api } from "../utils";
import { UserData } from "../interfaces";
import { useParams } from "react-router-dom";

export default function Contact() {
  const [contact, setContact] = useState<UserData>();
  const { login42 } = useParams<"login42">();
  useEffect(() => {
    let ignore = false;
    api<UserData>("http://localhost:3000/user/"+login42).then((result) => {
      if (!ignore) {
        setContact(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [login42]);


  return (
    <div id="contact">
      <div>
        <img
          key={contact?.id}
          src={contact?.avatar}
          alt={contact?.login42 || "unknown user" + " avatar picture"}
        />
      </div>

      <div>
        <h1>{contact?.name || "No Name"}</h1>
      </div>
    </div>
  );
}
