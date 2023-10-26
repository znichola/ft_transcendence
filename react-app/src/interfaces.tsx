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
  balls: Array<IBall>;
  timerAfk: number;
  type: boolean;
  id: number;
}

export interface IBall {
  pos: IPos;
  radius: number;
  speed: number;
  direction: IPos;
  mitosis: boolean;
  bounce: number;
}

// interface IBalls extends Array<IBall> {}

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
  onClick?: () => void;
}

export type TNotif =
  | "MESSAGE"
  | "FRIEND"
  | "CLASSICAL"
  | "SPECIAL"
  | "RESUME"
  | "ERROR"
  | "SUCCESS"
  | "INFO"
  | undefined;

// --------- socket message interfaces

export type Login42 = string;
export type TGameMode = "CLASSICAL" | "SPECIAL";

//  ws/user

export interface ISocDirectMessage {
  name: string; // so it's easy to display the name in the message notification
  message: ConvoMessage; // message contnent as it's stored so it can be added to the list, with out refetching everything
}

export interface ISocChatroomMessage {
  id: number;
  name: string;
  message: IMessage;
}

export interface ISocFriendRequest {
  from: Login42;
  name: string;
}

// ws/pong - receive

// challenge
export interface ISocChallenge {
  from: Login42;
  to: Login42;
  special: boolean;
}

interface IGameData {
  user1: Login42;
  user2: Login42;
  special: boolean;
}

// room-created
export interface ISocRoomCreated extends IGameData {}

// start-game
export interface ISocStartGame extends IGameData {}

// game-over
export interface ISocGameOver extends IGameData {}

// ws/pong - send

// accept
export interface ISocAcceptChallenge {
  opponent: Login42;
  special: boolean;
}

// challenge
export interface ISocIssueChallenge {
  invitedLogin: Login42;
  special: boolean;
}

// ready
export interface ISocConfirmGame {
  user1: string;
  user2: string;
  special: boolean;
}

// looking-for-game
export interface ISocLookingForGame {
  special: boolean;
}
