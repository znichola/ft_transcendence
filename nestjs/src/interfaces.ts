export interface FriendData {
  login42: string,
  name: string,
  status: string,
  avatar: string,
}

export interface UserFriends {
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
  status?: string;
  wins: number;
  losses: number;
  // friend_ids: [number];
  // game_ids: [number];
  avatar: string;
  bio?: string;
  tfaStatus: boolean;
}

// /game/id
export interface GameHistory {
  player_left: number;
  player_right: number;
  result: number;
}
