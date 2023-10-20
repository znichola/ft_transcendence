import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameState, Player } from 'src/interfaces';

const prisma: PrismaService = new PrismaService();

@Injectable()
export class PongService {
    async createGame(user1: number, user2: number, gameTypeId: number): Promise<number>
    {
        const game = await prisma.game.create({
            data: {
                gameType: gameTypeId,
                player1Id: user1,
                player2Id: user2,
            }
        })
        return (game.id);
    }

    async endGame(gameId: number, gameState: GameState)
    {
        await prisma.game.update({
            where: { id: gameId },
            data: { 
                player1Score: GameState.p1.score,
                player2Score: GameState.p2.score
            }
        })
    }
}
  