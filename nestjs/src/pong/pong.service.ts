import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IGameState } from 'src/interfaces';

const prisma: PrismaService = new PrismaService();

@Injectable()
export class PongService {
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

        const endedGame = await prisma.game.update({
            where: { id: gameId },
            data: { 
                player1Score: gameState.p1.score,
                player1EloChange: eloChanges[0],
                player1PosX: gameState.p1.pos.x,
                player1PosY: gameState.p1.pos.y,
                player2Score: gameState.p2.score,
                player2EloChange: eloChanges[1],
                player2PosX: gameState.p2.pos.x,
                player2PosY: gameState.p2.pos.y,
                ballPosX: gameState.balls[0].pos.x,
                ballPosY: gameState.balls[0].pos.y,
            },
            select: { player1StartElo: true, player2StartElo: true }
        });

        if (gameInfo.rated)
        {
            this.updateUserElo(gameState.p1.id, endedGame.player1StartElo + eloChanges[0]);
            this.updateUserElo(gameState.p2.id, endedGame.player2StartElo + eloChanges[1]);
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

        const eloChange1 = 32 * (player1Score - modifierPlayer1);
        const eloChange2 = 32 * (player2Score - modifierPlayer2);

        return [eloChange1, eloChange2];
    }

    async updateUserElo(login: string, newElo: number)
    {
        await prisma.user.update({
            where: { login42: login },
            data: {
                elo: newElo,
                eloHistory: { push: newElo },
                wins: { increment: newElo > 0 ? 1 : 0 },
                losses: { increment: newElo < 0 ? 1 : 0},
            }
        });
    }
}
