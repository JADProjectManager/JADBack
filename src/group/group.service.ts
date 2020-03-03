import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './group.model';
import { GroupDTO, GroupRO, GroupUpdatableDTO } from './group.dto';
import { UserSchema } from 'src/user/user.model';

@Injectable()
export class GroupService {

    constructor(@InjectModel('Group') private readonly groupModel: Model <Group>) {
       
    }

    async showAllGroups(populatePeople: boolean = false): Promise <GroupRO []>{
        
        if (populatePeople) {
            return await this.groupModel.find().populate({
                path: 'members',
                select: 'name',
                model: 'User'
            }).exec();
        } else {
            const groups = await this.groupModel.find().exec();
            return groups.map (group => group.toResponseObject(false));
        }
    }

    async getGroup(groupId: string, showMembers: boolean): Promise<GroupRO> {
        try {
            let group = this.groupModel.findById (groupId);
           
            if (!group) {
                throw new HttpException ('Group doesn\'t', HttpStatus.BAD_REQUEST);
            }
            return showMembers ? await group.populate({path:'members', model: 'User', select: 'name' }).exec() :
                                 (await group.exec()).toResponseObject();

        } catch (error) {
            throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST)
        }

    }
    
    async create (userId: string,data: GroupDTO): Promise <GroupRO> {
        const { name, description, type, members } = data;

        //Set up the user ids from string
        console.log (data);
        let group = await new this.groupModel({ name, description, type, members
           , "createdby": userId, "updatedby": userId });
    
        try {
            await group.save({options:{validateBeforeSave:true}});
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

        return group;
    }

    async update (id: string, userId: string, data: Partial<GroupUpdatableDTO>): Promise <GroupRO> {
        const { name, description, type, members } = data;

        try{ 
            const group = await this.groupModel.findByIdAndUpdate(
                {_id: id}, 
                {name, description, type, members, "updatedby": userId }, 
                {new: true, omitUndefined: true});
            
            if (!group) {
                throw new HttpException ('User doesn\'t', HttpStatus.BAD_REQUEST);
            }

            return group;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
    }

    async delete (id: string): Promise <any> {
        try { 
            let group = await this.groupModel.findById (id);
            await group.remove();
            return {deleted: true};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

}
