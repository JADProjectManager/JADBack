import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FileUpload } from './fileupload.model';
import { FileUploadDTO, FileUploadRO, FileUploadUpdatableDTO } from './fileupload.dto';

const FILE_STORE_PATH = process.env.FILE_STORE_PATH || './files';


@Injectable()
export class FileUploadService {

    constructor(@InjectModel('FileUpload') private readonly fileUploadModel: Model <FileUpload>) {
       
    }


    async getFileUpload(fileUploadId: string): Promise<FileUploadRO> {
        try {
            let fileUpload = await this.fileUploadModel.findById (fileUploadId)
                .populate({ path: 'createdby', select: 'name username'})
                .populate({ path: 'updatedby', select: 'name username'})
                .exec();
           
            if (!fileUpload) {
                throw new HttpException ('File doesn\'t exist' , HttpStatus.BAD_REQUEST);
            }
            return fileUpload;

        } catch (error) {
            throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST)
        }

    }
    
    async create (userId: string,data: FileUploadDTO): Promise <FileUploadRO> {
        const { filename, originalname, path, name, description, mimetype, size} = data;

        let fileUpload = await new this.fileUploadModel(
            {filename, originalname, path, name, description, mimetype, 
            size, "createdby": userId, "updatedby": userId });
    
        try {
            await fileUpload.save({options:{validateBeforeSave:true}});
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

        return fileUpload;
    }

    async update (id: string, userId: string, data: Partial<FileUploadUpdatableDTO>): Promise <FileUploadRO> {
        
        //path can't be updated.
        const { filename, originalname, name, description, mimetype, size } = data;

        try{ 
            const fileUpload = await this.fileUploadModel.findByIdAndUpdate(
                {_id: id}, 
                {filename, originalname, name, description, 
                 mimetype, size, "updatedby": userId }, 
                {new: true, omitUndefined: true});
            
            if (!fileUpload) {
                throw new HttpException ('User doesn\'t', HttpStatus.BAD_REQUEST);
            }

            return fileUpload;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async delete (id: string): Promise <any> {
        try { 
            let fileUpload = await this.fileUploadModel.findById (id);
            await fileUpload.remove();
            return {deleted: true};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async sendFile (fileId: string, res: any) {
        try {
            let file = await this.fileUploadModel.findById (fileId).exec();
                
           
            if (!file) {
                throw new HttpException ('File doesn\'t exist', HttpStatus.BAD_REQUEST);
            }
            res.sendFile (file.filename,
                {
                    root: FILE_STORE_PATH,
                    headers: {
                        'Content-Type': file.mimetype,
                        'Content-Length': file.size,
                        'Content-Disposition': `attachment; filename=${file.originalname}`
                    }
                }
                
            );

        } catch (error) {
            throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST)
        }

    }

}
