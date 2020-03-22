import { Module, Logger, Injectable } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProjectRequestController } from './projectrequest.controller';
import { ProjectRequestService } from './projectrequest.service';
import { ProjectRequestSchema} from './projectrequest.model';
import { loadRoles } from './projectrequest.roles';

import 'dotenv/config';
import { AuthzModule } from 'src/authz/authz.module';
import { FileUploadService } from 'src/fileupload/fileupload.service';
import { FileuploadModule } from 'src/fileupload/fileupload.module';
import { FileUploadSchema } from 'src/fileupload/fileupload.model';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/nest';

@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'ProjectRequest', schema: ProjectRequestSchema}]),
    MongooseModule.forFeature([{name: 'FileUpload', schema: FileUploadSchema}]),
    AuthzModule.forRoot(loadRoles)
  ],
  controllers: [ProjectRequestController],
  providers: [ProjectRequestService, FileUploadService],
})

export class ProjectRequestModule {

  constructor(private readonly projectRequestService: ProjectRequestService) {
    
  }

}
 