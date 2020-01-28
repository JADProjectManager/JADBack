import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessControlModule } from 'nest-access-control';


import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema} from './user.model';
import { roles } from './user.roles';


@Module({
  imports: [ 
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost/nest',
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
 