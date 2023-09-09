import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db:{
                    url:"postgresql://postgres:1234@postgres:5432/testdb?schema=public"
                },
            },
        });
    }
}
