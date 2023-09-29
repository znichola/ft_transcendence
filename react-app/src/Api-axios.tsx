import axios from "axios";
import { UserData } from "./interfaces";

// const BASE_URL = "/api/";
const BASE_URL = "http://localhost:8080/api/";

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const getCurrentUser = async () =>
  authApi.get<string>("/auth/user").then((res) => res.data);

export const getUserData = async (login42: string | undefined) => {
  return authApi.get<UserData>("/user/" + login42).then((res) => res.data);
}

export const getCurrentUserData = async () => {
  return () => {
    authApi.get<string>("/auth/user").then((res) => res.data).then().catch()
    ;
  }
  
  
}