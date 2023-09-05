import { useState } from 'react';
import { api } from './utils.tsx'

interface MyData {
  id: number;
  user: string;
  friends: number;
}


function FetchUser() {
  const [user, setUser] = useState("");

    const promise = api<MyData>("http://localhost:3000/user/defaultus")
    promise.then((value) => { setUser(value.user)})
  return (
    <div>
      <ul>
        {user}
      </ul>
    </div>
  );
}



export default FetchUser;