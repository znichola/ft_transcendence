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
  status?: TUserStatus;
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

export type TUserStatus =
  | "ONLINE"
  | "OFFLINE"
  | "UNAVAILABLE"
  | "INGAME"
  | undefined;

// --------- user
export interface IUsersAll {
  page?: number;
  status?: TUserStatus;
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

export interface IChatroomPost {
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
  isBlocked: boolean;
}

export interface IMessagePost {
  senderLogin42: string;
  content: string;
}

export type TChatroomRole = "MEMBER" | "ADMIN" | "OWNER";

export interface IMember {
  login42: string;
  role: TChatroomRole;
  isMuted: boolean;
}

export interface IPutUserProfile {
  bio?: string;
  name?: string;
}

// --------- pong / gameState

export type I2D = { width: number; height: number };
export type TColor = { r: number; g: number; b: number };

export interface IGameState {
  p1: IPlayer;
  p2: IPlayer;
  balls: IBalls;
  timerAfk: number;
  type: boolean;
}
export interface IBall {
  pos: IPos;
  radius: number;
  speed: number;
  direction: IPos;
  mitosis: boolean;
  bounce: number;
}

interface IBalls extends Array<IBall> {}

export interface IPos {
  x: number;
  y: number;
}

export interface IDim {
  w: number;
  h: number;
}

export interface IPlayer {
  pos: IPos;
  dim: IDim;
  score: number;
  moveUp: boolean;
  moveDown: boolean;
  id: string | undefined;
  afk: boolean;
}

// --------- react app useage

export interface INotification {
  message?: string;
  from?: string;
  to?: string;
  type: TNotif;
  id?: string;
}

export type TNotif =
  | "MESSAGE"
  | "FRIEND"
  | "CLASSICAL"
  | "SPECIAL"
  | "RESUME"
  | "ERROR"
  | "INFO"
  | undefined;

// --------- socket message interfaces

export type Login42 = string;
export type TGameMode = "CLASSICAL" | "SPECIAL";

//  ws/user

export interface ISocChatroomMessage {
  id: number;
  message: IMessage;
}

export interface ISocDirectMessage {
  from: Login42;
  message: IMessage;
}

export interface ISocFriendRequest {
  from: Login42;
}

// ws/pong 

export interface ISocChallenge {
  from: Login42;
  type: TGameMode;
  id: number; // idk if this is needed
}

export interface ISocGameFound {
  from: Login42;
  type: TGameMode;
  id: number; // idk if this is needed
}

// ws/pong - send

export interface ISocAcceptChallenge {
  id: number;
  accept: boolean;
}


