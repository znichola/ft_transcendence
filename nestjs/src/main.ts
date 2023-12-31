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
    .addServer('/api/', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  app.use(cookieParser());
  app.enableCors({
    origin: [
      'https://api.intra.42.fr',
      process.env.SITE_URL,
    ],
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, Cookie',
    methods: 'GET,PUT,POST,DELETE',
  });
  await app.listen(3000);
}
bootstrap();
