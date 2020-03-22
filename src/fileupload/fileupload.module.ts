import { Module } from '@nestjs/common';
import { FileuploadController } from './fileupload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadSchema } from './fileupload.model';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadService } from './fileupload.service';
import { loadRoles } from './fileupload.roles';

import 'dotenv/config';
import { AuthzModule } from 'src/authz/authz.module';

const FILE_STORE_PATH = process.env.FILE_STORE_PATH || './files'


@Module({
  imports: [
    MulterModule.register({
      dest: FILE_STORE_PATH,
      
    }),
    MongooseModule.forFeature([{name: 'FileUpload', schema: FileUploadSchema}]),
    AuthzModule.forRoot(loadRoles)
  ],
  controllers: [FileuploadController],
  providers: [FileUploadService]
})
export class FileuploadModule {}
