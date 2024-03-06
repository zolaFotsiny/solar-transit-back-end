import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {


  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  app.enableCors();
  await app.listen(process.env.APP_PORT || 8080);
}


bootstrap();
