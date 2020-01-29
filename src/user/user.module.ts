import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessControlModule } from 'nest-access-control';


import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema} from './user.model';
import { roles } from './user.roles';

import 'dotenv/config';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/nest';


@Module({
  imports: [ 
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: MONGODB_URL,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
    }),
    MongooseModule.forFeature([{name: 'User',schema: UserSchema}]),
    AccessControlModule.forRoles(roles)
  ],
  controllers: [UserController],
  providers: [UserService]
})

export class UserModule {}
 