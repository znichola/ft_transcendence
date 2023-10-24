import { Body, ClassSerializerInterceptor, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { TfaService } from './tfa.service';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
    async disableTfa(@Param('username') username: string, @Res() res: Response, @Req() req: Request)
    {
        await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_USR].access_token);
        // res.setHeader('Content-Type', 'text/html');
        await this.tfaService.disableTfa(username);
        return ("OK");
    }

    @UseGuards(TfaGuard)
    @ApiOperation({
        summary: 'Login a user with 2FA enabled.',
        description:
          'Logs in a user if the 2FA code is correct.',
        requestBody: {
          description:
            'Body must include the 2FA code string.',
          required: true,
          content: {
            'application/json': {
              schema: {
                example: {
                  tfaCode: '123456',
                },
              },
            },
          },
        },
      })
    @Post(':username/login')
    async loginTfaUser(@Param('username') username: string, @Body() bodyData: TfaCodeDto, @Req() req: Request, @Res() res: Response)
    {
        await this.authService.verifyUser(username, req.cookies[process.env.COOKIE_TMP].access_token);

        if (!bodyData) throw new HttpException("Body data is missing.", HttpStatus.BAD_REQUEST);

        const userSecret = await this.tfaService.getTfaSecret(username);
        if (!userSecret) throw new HttpException("User not found or doesn't have 2FA active.", HttpStatus.NOT_FOUND);
        
        const isValid = this.tfaService.isTfaCodeValid(bodyData.tfaCode, userSecret);
        if (!isValid) throw new HttpException("Invalid Authentication code.", HttpStatus.UNAUTHORIZED);

        const token = await this.authService.getUserToken(username);
        if (!token) throw new HttpException('User not found.', HttpStatus.NOT_FOUND);

        res.cookie(process.env.COOKIE_TMP, '', { expires: new Date() });
        res.setHeader('Content-Type', 'text/html');
        res.cookie(process.env.COOKIE_USR, token, {
            domain: process.env.IP_ADDR,
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 3600000,
            });

        res.status(200).json({ login: username });
    }
}