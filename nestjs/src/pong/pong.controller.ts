import { Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PongService } from './pong.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGateway } from "src/user/user.gateway";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthService } from "src/auth/auth.service";
import { ChallengeEntity } from "src/user/user.entity";
import { IGameState } from "src/interfaces";

@ApiTags('Pong')
@Controller('pong')
export class PongController
{
    constructor (
        private readonly pongService: PongService,
        private readonly authService: AuthService,
        ) {}

    @UseGuards(AuthGuard)
    @Get('history/:username')
    async getUserHistory(@Param('username') username: string)
    {
        const rawGameHistory = await this.pongService.getUserGameHistory(username);
        const gameHistory: {player1: string, player2: string, rated: boolean, gameState: IGameState}[] = [];
        rawGameHistory.forEach((game) => {
            gameHistory.push({player1: game.player1.login42, player2: game.player2.login42, rated: game.rated, gameState: JSON.parse(game.gameStateString)});
        })
        return gameHistory;
    }
}