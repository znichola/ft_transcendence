import {UserEntity, PlayerEntity} from "./user/user.entity";

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
  tfaSecret: string;
}

// /game/id
export interface GameHistory {
  player_left: number;
  player_right: number;
  result: number;
}

// export interface GameState {
//   p1: Player;
//   p2: Player;
//   ball: ball;
//   timerAfk: number;
// }
// export interface ball {
//   pos: pos;
//   radius: number;
//   speed: number;
//   direction: pos;
// }
// export interface pos {
//   x: number;
//   y: number;
// }
//
// export interface dim {
//   w: number;
//   h: number;
// }
//
// export interface Player {
//   pos: pos;
//   dim: dim;
//   score: number;
//   moveUp: boolean;
//   moveDown: boolean;
//   id: string;
//   afk: boolean;
// }

// --------- pong / gameState

export type I2D = { width: number; height: number };

export interface IRoom {
  gs: IGameState;
  user1: PlayerEntity;
  user2: PlayerEntity;
  roomID: string;
  type: boolean;
  ranked: boolean;
  timer: number;
  started: boolean;
}

export interface IGameState {
  p1: IPlayer;
  p2: IPlayer;
  balls: Array<IBall>;
  timerAfk: number;
  type: boolean;
  id: number;//TODO CHECk IF OK
}

export interface IBall {
  pos: IPos;
  radius: number;
  speed: number;
  direction: IPos;
  mitosis: boolean;
  bounce: number;
}

// export interface IBalls extends Array<IBall> {}

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

export interface ISocGameOver {
  ratedGame: boolean;
  player1RatingChange: number;
  player2RatingChange: number;
  winner: string;
}