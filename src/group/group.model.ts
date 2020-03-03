import * as mongoose from 'mongoose';
import 'dotenv/config';
import * as _ from 'underscore';
import { UserRO } from 'src/user/user.dto';
import { GroupRO } from './group.dto';

export const GroupSchema = new mongoose.Schema({
    
    name: String,
    description: String,
    type: String, 
    
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    
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

  
GroupSchema.methods.toResponseObject = function (showMembers: boolean): GroupRO {
    const {id, name, description, type} = this;

    let group: any = {id, name, description, type};

    if (showMembers) {
        let members = this.members;
        group =  {...group, members};
    }

    return group;
}

GroupSchema.pre("save", function (next) {
    // store reference
    const group = this;

    //Refresh the updated date
    group.updated = new Date();

    next();
});


export interface Group {
    id: string;
    name: string;
    description: string,
    members?: UserRO[],
    created: Date;
    updated: Date;
    createdby: UserRO,
    updatedby: UserRO
}