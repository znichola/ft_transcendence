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
    const { authorization } = client.handshake.headers;
    console.log({authorization});
    const token: string = authorization;
    console.log('token: ', token);
    const payload = verify(token, process.env.JWT_SECRET);
    console.log('payload is :', payload);
    return payload;
  }
}
