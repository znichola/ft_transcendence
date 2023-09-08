
// /user/id
export interface UserData {
  id: number;
  user: string;
  elo: number;
  rank: number;
  status: "online" | "offline" | "ingame";
  wins: number;
  losses: number;
  friend_ids: [number];
  game_ids: [number];
  img_url: string;
}

// /game/id
export interface GameHistory {
  player_left: number;
  player_right: number;
  result: number;
}

