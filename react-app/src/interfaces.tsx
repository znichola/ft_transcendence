export interface FriendData {
  login42: string;
  name: string;
  status: string;
  avatar: string;
}

export interface UserFriends {
  friends: FriendData[];
  pending: FriendData[];
  requests: FriendData[];
}

export interface UserData {
  id: number;
  name: string;
  login42: string;
  elo: number;
  eloHistory: number[];
  status?: string;
  wins: number;
  losses: number;
  avatar: string;
  bio?: string;
}

// /game/id
export interface GameHistory {
  player_left: number;
  player_right: number;
  result: number;
}

export type UserStatus = "ONLINE" | "OFFLINE" | "UNAVAILABLE" | "INGAME";

// --------- user
export interface IUsersAll {
  page?: number;
  status?: UserStatus;
  name?: string;
}

// I think it's better we use convoMessage[] as the type instead
// export type ConvoMessages = ConvoMessage[];

// --------- conversations / directmessages / dm

export interface ConvoMessage {
  id: number;
  senderLogin42: string;
  content: string;
  sentAt: string;
}

export interface Converstaion {
  id: number;
  user1Login42: string;
  user2Login42: string;
}

// --------- chatrooms / chat

export type ChatroomStaus = "PUBLIC" | "PRIVATE" | "PROTECTED";

export interface IChatroom {
  id: number;
  name: string;
  ownerLogin42: string;
  status: ChatroomStaus;
}

export interface ChatroomPost {
  ownerLogin42: string;
  name: string;
  status: ChatroomStaus;
  password?: string;
}

export interface IMessage {
  id: number;
  senderLogin42: string;
  content: string;
  sentAt: string;
}

export interface IMessagePost {
  senderLogin42: string;
  content: string;
}

export type TChatroomRole = "MEMEBR" | "ADMIN" | "OWNER";

export interface IMember {
  login42: string;
  role: TChatroomRole;
  isMuted: boolean;
}

export interface IPutUserProfile {
  bio?: string;
  displayName?: string;
}
