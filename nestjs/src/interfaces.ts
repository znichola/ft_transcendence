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
}

// /game/id
export interface GameHistory {
  player_left: number;
  player_right: number;
  result: number;
}
