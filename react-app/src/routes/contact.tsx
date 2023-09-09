import { useState } from "react";
import { api } from "../utils";
import { UserData } from "../interfaces";

export default function Contact() {
  const [contact, setContact] = useState<UserData>();

  const promise = api<UserData>("http://localhost:3000/user/default42");
  promise.then((value) => {
    if (!value) setContact(value);
  });

  return (
    <div id="contact">
      <div>
        <img
          key={contact?.id}
          src={contact?.avatar}
          alt={contact?.username || "unknown user" + " avatar picture"}
        />
      </div>

      <div>
        <h1>
          {contact?.first || contact?.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
        </h1>
      </div>
    </div>
  );
}
