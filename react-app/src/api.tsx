// https://stackoverflow.com/questions/41103360/how-to-use-fetch-in-typescript

import { UserData } from "./interfaces";

// Standard variation
export async function api<T>(url: string): Promise<T> {
  // await new Promise(r => setTimeout(r, 2000))
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

// export function fetchAllUsers() {
//   api<UserData>("http://localhost:3000/user/")
//     .then((result) => {
//       return result;
//     })
//     .catch((err) => {
//       throw err;
//     });
// }

export function fetchAllUsers() {
  return api<UserData[]>("http://localhost:3000/user/");
}

export function fetchUser(login42: string) {
  api<UserData>("http://localhost:3000/user/" + login42)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      throw err;
    });
}
