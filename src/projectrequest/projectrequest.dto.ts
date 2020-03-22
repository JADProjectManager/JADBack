import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'
import { UserRO } from 'src/user/user.dto';
import { GroupRO } from "src/group/group.dto";
import { ProjectRequest } from "./projectrequest.model";
import { FileUploadRO } from "src/fileupload/fileupload.dto";

export class ProjectRequestDTO{

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    unit: string;

    @ApiProperty()
    @IsOptional()
    applicant: Partial<UserRO>; //If not introduced as User, still we have a name

    @ApiProperty()
    @IsOptional()
    functionalManagerName: string; //If not introduced as User, still we have a name

    @ApiProperty()
    @IsOptional()
    functionalManager: Partial<UserRO>;;
    
    @ApiProperty()
    @IsNotEmpty()
    sponsor: Partial<GroupRO>; //To transform to an Schema

    @ApiProperty()
    @IsNotEmpty()
    need: string;
    
    @ApiProperty()
    @IsNotEmpty()
    desiredFeatures: string;

    @ApiProperty()
    @IsNotEmpty()
    notDoingConsequences: string;

    @ApiProperty()
    @IsNotEmpty()
    strategicGoals: string;

    @ApiProperty()
    @IsNotEmpty()
    strategicGoalsExplanation: string;

    @ApiProperty()
    @IsNotEmpty()
    additionalInformation: string;

    @ApiProperty()
    @IsNotEmpty()
    affectedDepartments: string;

    @ApiProperty()
    @IsNotEmpty()
    benefitedMemberGroups: string;
   
    @ApiProperty()
    @IsNotEmpty()
    neededIntegrations: string;

    @ApiProperty()
    @IsOptional()
    attachedFiles?: [Partial<FileUploadRO>];

}

export type ProjectRequestUpdatableDTO = Partial<ProjectRequestDTO>;

export class ProjectRequestRO implements ProjectRequest{
    
    id: string;
    name: string;
    unit: string;
    applicant: UserRO;
    functionalManagerName?: string; //If not introduced as User, still we have a name
    functionalManager?: UserRO;
    sponsor: GroupRO; //To transform to an Schema
    need: string;
    desiredFeatures: string;
    notDoingConsequences: string;
    strategicGoals: string;
    strategicGoalsExplanation: string;
    additionalInformation: string;
    affectedDepartments: string;
    benefitedMemberGroups: string;
    neededIntegrations: string;

    attachedFiles: [FileUploadRO];
    created: Date;
    updated: Date;
    createdby: UserRO;
    updatedby: UserRO;
}