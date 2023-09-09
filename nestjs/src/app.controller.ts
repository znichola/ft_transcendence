import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
// mockUserData.ts

interface UserData {
  id: number;
  username: string;
  login42: string;
  elo: number;
  rank: number;
  status: 'online' | 'offline' | 'ingame';
  wins: number;
  losses: number;
  friend_ids: number[];
  game_ids: number[];
  avatar: string;
}

const userData: UserData[] = [
  {
    id: 1,
    username: 'Defaultus Maximus',
    login42: 'default42',
    elo: 1500,
    rank: 1,
    status: 'online',
    wins: 50,
    losses: 10,
    friend_ids: [2, 3],
    game_ids: [101, 102],
    avatar: 'https://i.imgflip.com/2/aeztm.jpg',
  },
  {
    id: 2,
    username: 'User2',
    login42: 'jane42',
    elo: 1400,
    rank: 2,
    status: 'offline',
    wins: 40,
    losses: 20,
    friend_ids: [1, 3],
    game_ids: [101],
    avatar: 'https://placekitten.com/g/200/200',
  },
  {
    id: 3,
    username: 'User3',
    login42: 'jane42',
    elo: 1600,
    rank: 3,
    status: 'ingame',
    wins: 55,
    losses: 15,
    friend_ids: [1, 2],
    game_ids: [102],
    avatar: 'https://placehold.co/400',
  },
];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
