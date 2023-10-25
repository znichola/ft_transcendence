import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') return true;

    const client: Socket = context.switchToWs().getClient();
    WsGuard.validateToken(client);

    return true;
  }

  
  static validateToken(client: Socket)
  {
    const token: string = client.handshake.headers.authorization; // client.handshake.auth.token;
    const payload = verify(token, process.env.JWT_SECRET);
    return payload;
  }
}
