export interface FriendData {
  login42: string;
  name: string;
  status: string;
  avatar: string;
}

export interface UserFriend {
  friends: FriendData[];
  pending: FriendData[];
  requests: FriendData[];
}

// /user/id
export interface UserData {
  id: number;
  name: string;
  login42: string;
  elo: number;
  eloHistory: number[];
  // rank: number;
  status?: string;
  wins: number;
  losses: number;
  // friend_ids: [number];
  // game_ids: [number];
  avatar: string;
  bio?: string;
}

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

// /game/id
export interface GameHistory {
  player_left: number;
  player_right: number;
  result: number;
}

export type ConvoMessages = ConvoMessage[];

interface ConvoMessage {
  id: number;
  senderLogin42: string;
  content: string;
  sentAt: string;
}

export type Converstaions = Converstaion[];

interface Converstaion {
  id: number;
  user1Login42: string;
  user2Login42: string;
}