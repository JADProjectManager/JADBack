import { Controller, Post, Get, Body, UsePipes, UseGuards, Put, Param, Delete, HttpException, HttpStatus, Response } from '@nestjs/common';
import { UseRoles, ACGuard, UserRoles } from 'nest-access-control';
import { ProjectRequestService } from './projectrequest.service';
import { ProjectRequestDTO, ProjectRequestUpdatableDTO } from './projectrequest.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthJWTGuard } from 'src/shared/authJWT.guard';
import { User } from 'src/user/user.decorator';
import * as _ from 'underscore';
import { Http2ServerResponse } from 'http2';
import { FileUploadService } from 'src/fileupload/fileupload.service';
import { FileUploadRO } from 'src/fileupload/fileupload.dto';


@Controller('/api/projectrequest')
export class ProjectRequestController {

    constructor (private projectRequestService: ProjectRequestService,
                 private fileUploadService: FileUploadService) {

    }
  
    @Get()
    @UseGuards(new AuthJWTGuard()) 
    showAllProjectRequests() {
        return this.projectRequestService.showAllProjectRequests();
    }

    @Get('/:id')
    @UseGuards(new AuthJWTGuard()) 
    getProjectRequest(@Param('id') id: string) {
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

    //Download the attached File
    @Get('/:id/file/:fileId')
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({resource: 'projectrequest', action: 'read', possession: 'own'})
    async readFile(@Param('id') id: string, @Param('fileId') fileId: string,  
                    @UserRoles() userRoles: any,  @User('id') userId: string,
                    @Response() res) {
        const projectRequest = await this.projectRequestService.getProjectRequest(id);
        
        //Write a condition to grant access to the file
    
        let found = false;
        for (let attachedFile in projectRequest.attachedFiles ){
           if (projectRequest.attachedFiles[attachedFile].valueOf() == fileId) {
               found = true;
           }
        }


        if (found){
            this.fileUploadService.sendFile (fileId,res);
        } else {
            console.log ('nonono');
            throw new HttpException ('File not found',HttpStatus.NOT_FOUND);
        }

    }
}
