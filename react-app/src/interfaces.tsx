// /user/id
export interface UserData {
  id: number;
  username: string;
  login42: string;
  elo: number;
  rank: number;
  status: "online" | "offline" | "ingame";
  wins: number;
  losses: number;
  friend_ids: [number];
  game_ids: [number];
  avatar: string;
}

// /game/id
export interface GameHistory {
  player_left: number;
  player_right: number;
  result: number;
}