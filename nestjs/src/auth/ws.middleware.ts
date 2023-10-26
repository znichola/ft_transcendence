import { Socket } from "socket.io";
import { WsGuard } from "src/ws/ws.guard";

export type SocketIOMiddleware = {
    (client: Socket, next: (err?: Error) => void);
}

export const SocketAuthMiddleware = (): SocketIOMiddleware => {
    return (client, next) => {
        try
        {
            WsGuard.validateToken(client);
            next();
        }
        catch (error)
        {
            console.log(error);
            next(error);
        }
    };
};