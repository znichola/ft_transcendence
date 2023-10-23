import { Body, ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
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
    @Get(':username')
    async register(@Param('username') username: string, @Res() res: Response, @Req() req: Request)
    {
        await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);
        const status = await this.tfaService.getTfaStatus(username);
        if (status) throw new HttpException("TFA is already enabled.", HttpStatus.BAD_REQUEST);
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
        await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);
        const status = await this.tfaService.getTfaStatus(username);
        if (status) throw new HttpException("TFA is already enabled.", HttpStatus.BAD_REQUEST);
        const userSecret = await this.tfaService.getTfaSecret(username);
        const isValid = this.tfaService.isTfaCodeValid(bodyData.tfaCode, userSecret);
        if (!isValid) throw new HttpException("Invalid Authentication code.", HttpStatus.UNAUTHORIZED);
        await this.tfaService.enableTfa(username);
    }

    @UseGuards(AuthGuard)
    @Patch(':username/disable')
    async disableTfa(@Param('username') username: string, @Body() bodyData: TfaCodeDto, @Req() req: Request)
    {
        await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);
        await this.tfaService.disableTfa(username);
    }

    @UseGuards(TfaGuard)
    @Post(':username/login')
    async login(@Param('username') username: string, @Body() bodyData: TfaCodeDto, @Res() res: Response, @Req() req: Request)
    {
        await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_TMP].access_token);
        const userSecret = await this.tfaService.getTfaSecret(username);
        const isValid = this.tfaService.isTfaCodeValid(bodyData.tfaCode, userSecret);
        if (!isValid) throw new HttpException("Invalid Authentication code.", HttpStatus.UNAUTHORIZED);
        const accessTokenCookie = this.authService.getUserToken(username, true);
        res.cookie(process.env.COOKIE_TMP, '', { expires: new Date() });
        res.cookie(process.env.COOKIE_USR, accessTokenCookie, {
            domain: 'localhost',
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 3600000,
          });

          return res.status(200).send({ login: username });
    }
}