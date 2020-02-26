import * as mongoose from 'mongoose';
import 'dotenv/config';
import * as _ from 'underscore';
import { UserRO } from 'src/user/user.dto';
import { GroupRO } from 'src/group/group.dto';

export const ProjectRequestSchema = new mongoose.Schema({
    
    name: String,
    unit: String,
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    functionalManagerName: String, //If not introduced as User, still we have a name
    
    functionalManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }, //To transform to an Schema

    need: String,
    desiredFeatures: String,
    notDoingConsequences: String,
    strategicGoals: String,
    strategicGoalsExplanation: String,


    additionalInformation: String,
    affectedDepartments: String,
    benefitedMemberGroups: String,

    neededIntegrations: String,
    

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

ProjectRequestSchema.pre("save", function (next) {
    // store reference
    const projectRequest = this;

    //Refresh the updated date
    projectRequest.updated = new Date();

    next();
});

export interface ProjectRequest {
    id: string;
    name: string;
    unit: string,
    applicant: UserRO;
    
    functionalManagerName?: string, //If not introduced as User, still we have a name
    
    functionalManager?: UserRO;

    sponsor: GroupRO, //To transform to an Schema

    need: string,
    desiredFeatures: string,
    notDoingConsequences: string,
    strategicGoals: string,
    strategicGoalsExplanation: string,


    additionalInformation: string,
    affectedDepartments: string,
    benefitedMemberGroups: string,
    neededIntegrations: string,
    created: Date;
    updated: Date;
    createdby: UserRO;
    updatedby: UserRO;
}