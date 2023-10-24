import { Controller, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PongService } from './pong.service';
import { Request, Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserGateway } from "src/user/user.gateway";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthService } from "src/auth/auth.service";
import { ChallengeEntity } from "src/user/user.entity";

@ApiTags('Pong')
@Controller('pong')
export class PongController
{
    constructor (
        private readonly pongService: PongService,
        private readonly userGateway: UserGateway,
        private readonly authService: AuthService,
        ) {}

    @UseGuards(AuthGuard)
    @Post('/challenge/:target')
    async challengePlayer(@Param('target') target: string, @Req() req: Request, @Query('mode') mode?: string)
    {
        let specialGame: boolean = false;
        if (mode == 'special')  specialGame = true;

        const userLogin: string = await this.authService.getLoginFromToken(req.cookies[process.env.COOKIE_USR].access_token);

        const gameId: number = await this.pongService.createGame(specialGame, false, userLogin, target);
        const challenge = new ChallengeEntity(userLogin, gameId, specialGame);
        
        this.userGateway.sendChallenge(target, challenge);

        return "OK";
    }
}