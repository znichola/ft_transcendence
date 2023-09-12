export interface UserFriends {
  user1Id: number;
  user2Id: number;
  status: string;
  user1: UserData;
  user2: UserData;
}

// /user/id
export interface UserData {
  id: number;
  name: string;
  login42: string;
  elo: number;
  // rank: number;
  status?: string;
  statusId: number;
  wins: number;
  losses: number;
  // friend_ids: [number];
  // game_ids: [number];
  avatar: string;
  bio?: string;
}

// /game/id
export interface GameHistory {
  player_left: number;
  player_right: number;
  result: number;
}
