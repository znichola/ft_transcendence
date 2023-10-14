import { Body, ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { TfaService } from './tfa.service';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { TfaCodeDto } from './dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { TfaGuard } from './tfa.guard';
import { toBuffer } from 'qrcode'

@ApiTags('Authentication')
@Controller('tfa')
@UseInterceptors(ClassSerializerInterceptor)
export class TfaController {
    constructor (
        private readonly tfaService: TfaService,
        private readonly authService: AuthService,
    ) {}

    @UseGuards(AuthGuard)
    @Post(':username')
    async register(@Param('username') username: string, @Res() res: Response, @Req() req: Request)
    {
        this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);
        const { otpauthUrl } = await this.tfaService.generateTfaSecret(username);
        const qrCode = await toBuffer(otpauthUrl);
        res.header('Content-Type', 'image/png');
        res.header('Content-Disposition', 'inline; filename=qr.png');
        res.send(qrCode);
    }

    @UseGuards(AuthGuard)
    @Post(':username/enable')
    async enableTfa(@Param('username') username: string, @Body() bodyData: TfaCodeDto, @Req() req: Request)
    {
        this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);
        const userSecret = await this.tfaService.getTfaSecret(username);
        const isValid = this.tfaService.isTfaCodeValid(bodyData.tfaCode, userSecret);
        if (!isValid) throw new HttpException("Invalid Authentication code.", HttpStatus.UNAUTHORIZED);
        await this.tfaService.enableTfa(username);
    }

    @UseGuards(TfaGuard)
    @Post(':username/login')
    async login(@Param('username') username: string, @Body() bodyData: TfaCodeDto, @Res() res: Response, @Req() req: Request)
    {
        this.authService.verifyUser(username, req.cookies[process.env.COOKIE_TMP].access_token);
        const userSecret = await this.tfaService.getTfaSecret(username);
        const isValid = this.tfaService.isTfaCodeValid(bodyData.tfaCode, userSecret);
        if (!isValid) throw new HttpException("Invalid Authentication code.", HttpStatus.UNAUTHORIZED);

        const accessTokenCookie = this.authService.getUserToken(username, true);
        res.cookie(process.env.COOKIE_USR, accessTokenCookie, {
            domain: 'localhost',
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000,
          });

          res.status(201);
          return ("OK");
    }
}