import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IGameState } from 'src/interfaces';
import { UserGateway } from 'src/user/user.gateway';

const prisma: PrismaService = new PrismaService();

@Injectable()
export class PongService {
    constructor(private readonly userGateway: UserGateway){}
    async getUserElo(userLogin: string): Promise<number>
    {
        const user = await prisma.user.findUnique({where: { login42: userLogin } });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        return user.elo;
    }

    async createGame(gameSpecial: boolean, rated: boolean, player1: string, player2: string): Promise<number>
    {
        const user1 = await prisma.user.findUnique({
            where: { login42: player2 }
        });
        const user2 = await prisma.user.findUnique({
            where: { login42: player2 }
        });
        const game = await prisma.game.create({
            data: {
                special: gameSpecial,
                rated: rated,
                player1Id: user1.id,
                player1StartElo: user1.elo,
                player2Id: user2.id,
                player2StartElo: user2.elo,
            }
        })
        return (game.id);
    }

    async endGame(gameState: IGameState)
    {
        const gameInfo = await prisma.game.findUnique({ 
            where: { id: gameState.id },
            select: {
                rated: true,
                player1StartElo: true,
                player2StartElo: true,
             },
        });

        let eloChanges: number[] = [];

        if (gameInfo.rated == true)
        {
            const player1Score = 
            gameState.p1.score > gameState.p2.score ? 1 
            : gameState.p1.score == gameState.p2.score ? 0.5 : 0;
    
            eloChanges = this.calculateEloChange(
                gameInfo.player1StartElo,
                gameInfo.player2StartElo,
                player1Score);
        }
        else eloChanges = [0, 0];
        const stringState = JSON.stringify(gameState);
        const endedGame = await prisma.game.update({
            where: { id: gameState.id },
            data: { 
                player1Score: gameState.p1.score,
                player1EloChange: eloChanges[0],
                player2Score: gameState.p2.score,
                player2EloChange: eloChanges[1],
                gameStateString: stringState
            },
            select: { 
                player1: { select: { login42: true, elo: true } },
                player2: { select: { login42: true, elo: true } },
            }
        });

        if (gameInfo.rated)
        {
            this.updateUserElo(endedGame.player1.login42, endedGame.player1.elo, eloChanges[0]);
            this.updateUserElo(endedGame.player2.login42, endedGame.player2.elo, eloChanges[1]);
        }
    }

    async cancelGame(gameId: number)
    {
        await prisma.game.delete({ where: { id: gameId }});
    }

    calculateEloChange(player1Elo: number, player2Elo: number, player1Score: number) : number[]
    {
        const modifierPlayer1 = 1 / (1 + 10 ** ((player2Elo - player1Elo) / 400));
        const modifierPlayer2 = 1 / (1 + 10 ** ((player1Elo - player2Elo) / 400));

        const player2Score = 1 - player1Score;

        const eloChange1 = Math.round(32 * (player1Score - modifierPlayer1));
        const eloChange2 = Math.round(32 * (player2Score - modifierPlayer2));

        return [eloChange1, eloChange2];
    }

    async updateUserElo(login: string, startElo: number, gainElo: number)
    {
        const newElo = startElo + gainElo;
        await prisma.user.update({
            where: { login42: login },
            data: {
                elo: newElo,
                eloHistory: { push: newElo },
                wins: { increment: newElo > startElo ? 1 : 0 },
                losses: { increment: newElo < startElo ? 1 : 0},
            }
        });
    }
}
