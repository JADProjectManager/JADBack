import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, UseGuards, UsePipes, Logger, Body } from '@nestjs/common';
import { UseRoles, ACGuard } from 'nest-access-control';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthJWTGuard } from 'src/shared/authJWT.guard';

import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { extname } from 'path';
import { FileUploadDTO } from './fileupload.dto';
import { FileUploadService } from './fileupload.service';
import { User } from 'src/user/user.decorator';
import 'dotenv/config';

const FILE_STORE_PATH = process.env.FILE_STORE_PATH || './files';
const ALLOWED_EXTENSIONS = process.env.FILE_ALLOWED_DOCUMENTS || 'pdf||docx||odt';

@Controller('api/fileupload')
export class FileuploadController {

  constructor(private fileUploadService: FileUploadService) {

  }

  //Upload the tempory file using POST
  @Post()
  @UseGuards(new AuthJWTGuard(), ACGuard)
  @UseRoles({ resource: 'tempfile', action: 'create', possession: 'any' })
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: FILE_STORE_PATH,
        filename: this.editFileName,
      }),
      fileFilter: this.documentFileFilter,
    }),
  )
  async uploadedTempFile(@UploadedFile() file, @Body() data: FileUploadDTO, @User('id') userId) {
    const { filename, originalname, path, size, mimetype, encoding } = file;

    data = { ...data, filename, originalname, path, size, mimetype, encoding };
    return await this.fileUploadService.create(userId, data);
  }

  //Upload the temporary files using POST
  @Post('uploadmultiple')
  @UseGuards(new AuthJWTGuard(), ACGuard)
  @UseRoles({ resource: 'tempfile', action: 'create', possession: 'any' })
  @UseInterceptors(
    FilesInterceptor('document', 20, {
      storage: diskStorage({
        destination: FILE_STORE_PATH,
        filename: this.editFileName,
      }),
      fileFilter: this.documentFileFilter,
    }),
  )
  async uploadMultipleTempFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach(file => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  documentFileFilter = (req, file, callback) => {
    if (!file.originalname.match('/\.('+ALLOWED_EXTENSIONS+')$/')) {
      return callback(new Error('Only document files are allowed!'), false);
    }
    callback(null, true);
  };

  editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    callback(null, `${name}-${randomName}${fileExtName}`);
  };
}
