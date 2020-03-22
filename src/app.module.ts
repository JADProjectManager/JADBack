import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express'
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';


import { UserModule } from './user/user.module';
import { ProjectRequestModule } from './projectrequest/projectrequest.module';
import { GroupModule } from './group/group.module';
import { FileuploadModule } from './fileupload/fileupload.module';

import 'dotenv/config';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/nest';


@Module({
  imports: [MongooseModule.forRootAsync({
    useFactory: () => ({
      uri: MONGODB_URL,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
  }),UserModule, GroupModule, ProjectRequestModule, FileuploadModule
   ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
