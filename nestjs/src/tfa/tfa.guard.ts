import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
  
@Injectable()
export class TfaGuard implements CanActivate 
{
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> 
	{
		const request = context.switchToHttp().getRequest();
		const token = request.cookies[process.env.COOKIE_TMP];
		if (!token) 
		{
				throw new UnauthorizedException();
		}
		try 
		{
				const payload = await this.jwtService.verifyAsync(token.access_token, {
				secret: process.env.JWT_SECRET,
				});
				request['user'] = payload;
		} 
		catch 
		{
				throw new UnauthorizedException();
		}
		return true;
	}
}
  