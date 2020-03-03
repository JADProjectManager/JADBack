import { Controller, Post, Get, Body, UsePipes, UseGuards, Put, Param, Delete, Query } from '@nestjs/common';
import { UseRoles, ACGuard, UserRoles } from 'nest-access-control';
import { GroupService } from './group.service';
import { GroupDTO, GroupUpdatableDTO } from './group.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthJWTGuard } from 'src/shared/authJWT.guard';
import { User } from 'src/user/user.decorator';
import * as _ from 'underscore';


@Controller('/api/group')
export class GroupController {

    constructor (private groupService: GroupService) {

    }
  
    @Get()
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    showAllUsers(@Query('showmembers') reqShowMembers: string, @UserRoles() userRoles ) {
        //Check if request asks for it and has the permission to show it.
        let reqMembers = reqShowMembers === 'true' ? true : false;
        const showMembers = (reqMembers && _.contains (userRoles,'GROUP_ADMIN'));
    
        return this.groupService.showAllGroups(showMembers);
    }

    @Get('/:id')
    @UseGuards(new AuthJWTGuard()) 
    getUser(@Param('id') id: string, @Query ('showmembers') reqShowMembers, @UserRoles() userRoles) {
        let reqMembers = reqShowMembers === 'true' ? true : false;
        const showMembers = (reqMembers && _.contains (userRoles,'GROUP_ADMIN'));
        return this.groupService.getGroup(id,showMembers);
    }

    @Post()
    @UsePipes (new ValidationPipe())
    @UseGuards(new AuthJWTGuard(), ACGuard)
    @UseRoles({ resource: 'group', action: 'create', possession: 'any'})
    create(@Body() data: GroupDTO, @User('id') userId) {
        return this.groupService.create(userId, data);
    }

    @Put('/:id')
    @UsePipes (new ValidationPipe())
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({ resource: 'group', action: 'update', possession: 'any'}) 
    async update(@Param('id') id, @User('id') userId, @UserRoles() userRoles: any, @Body() data: GroupUpdatableDTO) {
        return this.groupService.update(id, userId, data);
   }
    
    @Delete('/:id')
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({resource: 'group', action: 'delete', possession: 'any'}) 
    async delete(@Param('id') id,  @UserRoles() userRoles: any,  @User('id') userId) {
        return this.groupService.delete(id);
    }


}
