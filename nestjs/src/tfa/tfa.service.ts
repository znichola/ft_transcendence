import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';

const prisma: PrismaService = new PrismaService();

@Injectable()
export class TfaService {
    isTfaCodeValid(tfaCode: string, userSecret: string)
    {
        return authenticator.verify({
            token: tfaCode,
            secret: userSecret,
        })
    }

    async generateTfaSecret(userLogin: string)
    {
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(userLogin, process.env.APP_NAME, secret);

        await this.setTfaSecret(userLogin, secret);

        return {
            secret,
            otpauthUrl
        }
    }

    async pipeQrCodeStream(stream: Response, otpauthUrl: string)
    {
        return toFileStream(stream, otpauthUrl);
    }

    async getTfaStatus(login: string): Promise<boolean>
    {
        const user = await prisma.user.findUnique({where: {login42: login}});
        return user.tfaStatus;
    }

    async setTfaSecret(login: string, secret: string)
    {
        await prisma.user.update({
        where: { login42: login },
        data: { tfaSecret: secret },
        });
    }

    async getTfaSecret(login: string): Promise<string>
    {
        const user = (await prisma.user.findUnique({
            where: { login42: login },
            select: { tfaSecret: true },
        }));
        return user.tfaSecret;
    }

    async enableTfa(login: string)
    {
        await prisma.user.update({
            where: { login42: login },
            data: { tfaStatus: true },
        });
    }

    async disableTfa(login: string)
    {
        await prisma.user.update({
            where: { login42: login },
            data: { tfaSecret: null, tfaStatus: false }
        });
    }
}