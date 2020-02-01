import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import 'dotenv/config';

const port = process.env.PORT || 3000; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
  .setTitle('JADBack api example')
  .setDescription('This is the JAD api description')
  .setVersion('1.0')
  .addTag('jadback')
  .build();
  
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);


  Logger.log (`JAD Backend API is listening at ${port}`);
}
bootstrap();
