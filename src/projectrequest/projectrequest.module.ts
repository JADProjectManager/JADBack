import { Module, Logger, Injectable } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectRequestController } from './projectrequest.controller';
import { ProjectRequestService } from './projectrequest.service';
import { ProjectRequestSchema} from './projectrequest.model';
import { loadRoles } from './projectrequest.roles';

import 'dotenv/config';
import { AuthzModule } from 'src/authz/authz.module';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/nest';


@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'ProjectRequest', schema: ProjectRequestSchema}]),
    AuthzModule.forRoot(loadRoles)
  ],
  controllers: [ProjectRequestController],
  providers: [ProjectRequestService],
})

export class ProjectRequestModule {

  constructor(private readonly projectRequestService: ProjectRequestService) {
    
  }

}
 