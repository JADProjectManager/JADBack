import { Module, Logger, Injectable } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { GroupSchema} from './group.model';
import { loadRoles } from './group.roles';

import 'dotenv/config';
import { AuthzModule } from 'src/authz/authz.module';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/nest';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'Group', schema: GroupSchema}]),
    AuthzModule.forRoot(loadRoles)
  ],
  controllers: [GroupController],
  providers: [GroupService],
})

export class GroupModule {

  constructor(private readonly groupService: GroupService) {
    
  }

}
 