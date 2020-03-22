import * as mongoose from 'mongoose';
import 'dotenv/config';
import { UserRO } from 'src/user/user.dto';

export const FileUploadSchema = new mongoose.Schema({
    
    filename: String,
    originalname: String,
    path: String,
    encoding: String,
    mimetype: String,
    size: Number,
   
    name: String,
    description: String,

    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

FileUploadSchema.pre("save", function (next) {
    // store reference
    const fileUpload = this;

    //Refresh the updated date
    fileUpload.updated = new Date();

    next();
});

export interface FileUpload {
    id: string;
    filename: string,
    originalname: string,
    encoding: string,
    path: string,
    name: string,
    description: string,
    mimetype: string,
    size: number,
    created: Date;
    updated: Date;
    createdby: UserRO;
    updatedby: UserRO;
}