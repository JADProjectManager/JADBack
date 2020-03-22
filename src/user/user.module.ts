import { Module, Logger, Injectable } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema} from './user.model';

import 'dotenv/config';
import { AuthzModule } from 'src/authz/authz.module';
import { loadRoles } from './user.roles';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'User',schema: UserSchema}]),
    AuthzModule.forRoot (loadRoles)
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class UserModule {

  constructor(private readonly userService: UserService) {
    const deployAdmin = process.env.CREATE_DEFAULT_DATA;

    if (deployAdmin) {
      this.userService.createDefaultData();
    }
  }

}
 