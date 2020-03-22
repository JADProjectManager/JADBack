import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'
import { UserRO } from 'src/user/user.dto';
import { FileUpload } from "./fileupload.model";

export class FileUploadDTO{

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsOptional()
    description: string;
    
    //Calculated from uploaded file
    filename: string;
    size: number;
    originalname: string;
    path: string; 
    mimetype: string;
    encoding: string;
}

export type FileUploadUpdatableDTO = Partial<FileUploadDTO>;

export class FileUploadRO implements FileUpload{
    
    id: string;
    filename: string;
    originalname: string;
    path: string
    size: number;
    mimetype: string;
    encoding: string;

    name: string;
    description: string;
    
    created: Date;
    updated: Date;
    createdby: UserRO;
    updatedby: UserRO;
}