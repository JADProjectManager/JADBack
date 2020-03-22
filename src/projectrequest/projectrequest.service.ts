import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectRequest } from './projectrequest.model';
import { ProjectRequestDTO, ProjectRequestRO, ProjectRequestUpdatableDTO } from './projectrequest.dto';

@Injectable()
export class ProjectRequestService {

    constructor(@InjectModel('ProjectRequest') private readonly projectRequestModel: Model <ProjectRequest>) {
       
    }

    async showAllProjectRequests() {
        return await this.projectRequestModel.find().
            populate({ path: 'applicant', select: 'name username'}).
            populate({ path: 'sponsor', model: 'Group', select: 'name' }).
            exec();
    }

    async getProjectRequest(projectRequestId: string): Promise<ProjectRequestRO> {
        try {
            let projectRequest = await this.projectRequestModel.findById (projectRequestId).
                populate({ path: 'applicant', select: 'name username'}).
                populate({ path: 'sponsor', model: 'Group', select: 'name' }).exec();
           
            if (!projectRequest) {
                throw new HttpException ('Project Request doesn\'t', HttpStatus.BAD_REQUEST);
            }
            return projectRequest;

        } catch (error) {
            throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST)
        }

    }
    
    async create (userId: string,data: ProjectRequestDTO): Promise <ProjectRequestRO> {
        const { name, unit, functionalManagerName,
                functionalManager, sponsor, need, desiredFeatures,
                notDoingConsequences, strategicGoals, strategicGoalsExplanation,
                additionalInformation, attachedFiles, affectedDepartments, benefitedMemberGroups,
                neededIntegrations } = data;
  

        //Set up the user ids from string
        console.log (data);
        let projectRequest = await new this.projectRequestModel({name, unit, functionalManagerName,
            functionalManager, sponsor, need, desiredFeatures,
            notDoingConsequences, strategicGoals, strategicGoalsExplanation,
            additionalInformation, attachedFiles,  affectedDepartments, benefitedMemberGroups,
            neededIntegrations, "applicant": userId, "createdby": userId, "updatedby": userId });
    
        try {
            await projectRequest.save({options:{validateBeforeSave:true}});
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

        return projectRequest;
    }

    async update (id: string, userId: string, data: Partial<ProjectRequestUpdatableDTO>): Promise <ProjectRequestRO> {
        const { name, unit, functionalManagerName, applicant,
            functionalManager, sponsor, need, desiredFeatures,
            notDoingConsequences, strategicGoals, strategicGoalsExplanation,
            additionalInformation, attachedFiles, affectedDepartments, benefitedMemberGroups,
            neededIntegrations } = data;

        try{ 
            const projectRequest = await this.projectRequestModel.findByIdAndUpdate(
                {_id: id}, 
                {name, unit, functionalManagerName, applicant,
                    functionalManager, sponsor, need, desiredFeatures,
                    notDoingConsequences, strategicGoals, strategicGoalsExplanation,
                    additionalInformation, attachedFiles, affectedDepartments, benefitedMemberGroups,
                    neededIntegrations, "updatedby": userId }, 
                {new: true, omitUndefined: true});
            
            if (!projectRequest) {
                throw new HttpException ('User doesn\'t', HttpStatus.BAD_REQUEST);
            }

            return projectRequest;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
    }

    async delete (id: string): Promise <any> {
        try { 
            let projectRequest = await this.projectRequestModel.findById (id);
            await projectRequest.remove();
            return {deleted: true};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}
