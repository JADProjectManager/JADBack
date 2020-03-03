import { Controller, Post, Get, Body, UsePipes, UseGuards, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UseRoles, ACGuard, UserRoles } from 'nest-access-control';
import { ProjectRequestService } from './projectrequest.service';
import { ProjectRequestDTO, ProjectRequestUpdatableDTO } from './projectrequest.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthJWTGuard } from 'src/shared/authJWT.guard';
import { User } from 'src/user/user.decorator';
import * as _ from 'underscore';


@Controller('/api/projectrequest')
export class ProjectRequestController {

    constructor (private projectRequestService: ProjectRequestService) {

    }
  
    @Get()
    @UseGuards(new AuthJWTGuard()) 
    showAllUsers() {
        return this.projectRequestService.showAllProjectRequests();
    }

    @Get('/:id')
    @UseGuards(new AuthJWTGuard()) 
    getUser(@Param('id') id: string) {
        return this.projectRequestService.getProjectRequest(id);
    }

    @Post()
    @UsePipes (new ValidationPipe())
    @UseGuards(new AuthJWTGuard(), ACGuard)
    @UseRoles({ resource: 'projectrequest', action: 'create', possession: 'own'})
    create(@Body() data: ProjectRequestDTO, @User('id') userId) {
        return this.projectRequestService.create(userId, data);
    }

    @Put('/:id')
    @UsePipes (new ValidationPipe())
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({ resource: 'projectrequest', action: 'update', possession: 'own'}) 
    async update(@Param('id') id, @User('id') userId, @UserRoles() userRoles: any, @Body() data: ProjectRequestUpdatableDTO) {
        const projectRequest = await this.projectRequestService.getProjectRequest(id);

        if (projectRequest.applicant.id == userId || _.contains(userRoles,'PR_MANAGE_ANY') ) {
            return this.projectRequestService.update(id, userId, data);
        } else {
            throw new HttpException ('Not authorized to update this project Request', HttpStatus.FORBIDDEN);
        }
    }
    
    @Delete('/:id')
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({resource: 'projectrequest', action: 'delete', possession: 'own'}) 
    async delete(@Param('id') id,  @UserRoles() userRoles: any,  @User('id') userId) {
        const projectRequest = await this.projectRequestService.getProjectRequest(id);

        if (projectRequest.applicant.id == userId || _.contains(userRoles,'PR_MANAGE_ANY')) {
            return this.projectRequestService.delete(id);
        } else {
            throw new HttpException ('Not authorized to delete this project Request', HttpStatus.FORBIDDEN);
        }
    }

}
