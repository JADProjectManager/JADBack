import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';

import 'dotenv/config';

const port = process.env.PORT || 3000; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  Logger.log (`JAD Backend API is listening at ${port}`);
}
bootstrap();
