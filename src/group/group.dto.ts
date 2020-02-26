import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'
import { UserRO } from 'src/user/user.dto';
import { Group } from './group.model';

export class GroupDTO{

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    type: string;

    @ApiProperty()
    @IsOptional()
    members: [Partial<UserRO>]; //If not introduced as User, still we have a name
}

export type GroupUpdatableDTO = Partial<GroupDTO>;

export class GroupRO implements Group {
    id: string;
    name: string;
    description: string;
    type: string;
    members?: [UserRO];
    created: Date;
    updated: Date;
    createdby: UserRO;
    updatedby: UserRO;
}