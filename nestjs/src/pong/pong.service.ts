import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IGameState } from 'src/interfaces';

const prisma: PrismaService = new PrismaService();

@Injectable()
export class PongService {
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

    async endGame(gameId: number, gameState: IGameState)
    {
        await prisma.game.update({
            where: { id: gameId },
            data: { 
                player1Score: gameState.p1.score,
                player1PosX: gameState.p1.pos.x,
                player1PosY: gameState.p1.pos.y,
                player2Score: gameState.p2.score,
                player2PosX: gameState.p2.pos.x,
                player2PosY: gameState.p2.pos.y,
                ballPosX: gameState.ball.pos.x,
                ballPosY: gameState.ball.pos.y,
            }
        })
    }

    async cancelGame(gameId: number)
    {
        await prisma.game.delete({ where: { id: gameId }});
    }
}
