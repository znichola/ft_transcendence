import { Body, ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { TfaService } from './tfa.service';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('tfa')
@UseInterceptors(ClassSerializerInterceptor)
export class TfaController {
    constructor (
        private readonly tfaService: TfaService,
        private readonly authService: AuthService,
    ) {}

    @Post(':username')
    async register(@Param('username') username: string, @Res() res: Response)
    {
        console.log('allo');
        const { otpauthUrl } = await this.tfaService.generateTfaSecret(username);
        return this.tfaService.pipeQrCodeStream(res, otpauthUrl);
    }

    @Post(':username/enable')
    async enableTfa(@Param('username') username: string, @Body() bodyData)
    {
        const userSecret = await this.tfaService.getTfaSecret(username);
        const isValid = this.tfaService.isTfaCodeValid(bodyData.tfaCode, userSecret);
        if (!isValid) throw new HttpException("Invalid Authentication code.", HttpStatus.UNAUTHORIZED);
        await this.tfaService.enableTfa(username);
    }

    @Post(':username/login')
    async login(@Param('username') username: string, @Body() bodyData, @Res() res: Response)
    {
        const isValid = this.tfaService.isTfaCodeValid(bodyData.tfaCode, username);
        if (!isValid) throw new HttpException("Invalid Authentication code.", HttpStatus.UNAUTHORIZED);

        const accessTokenCookie = this.authService.getUserToken(username, true);
        res.cookie('test', accessTokenCookie, {
            domain: 'localhost',
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000,
          });

          return res.status(302).send('/ranking' );
    }
}