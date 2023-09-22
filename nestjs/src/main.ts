import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  
  const options = new DocumentBuilder()
    .setTitle('Transcending Backend')
    .setDescription('API for ft_transcendance project')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  
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
