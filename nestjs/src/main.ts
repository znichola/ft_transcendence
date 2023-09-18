import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:5173', "https://api.intra.42.fr"],
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Cookie',
    methods: 'GET,PUT,POST,DELETE',
  });
  await app.listen(3000);
}
bootstrap();
