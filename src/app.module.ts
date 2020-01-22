import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

import 'dotenv/config';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/nest';

@Module({
  imports: [MongooseModule.forRootAsync({
    useFactory: () => ({
      uri: 'mongodb://localhost/nest',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
  }),
  UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
