import { Controller, Post, Get, Body, UsePipes, UseGuards, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UseRoles, ACGuard } from 'nest-access-control';
import { UserService } from './user.service';
import { UserDTO, UserUpdatableDTO, UserCredentialsDTO } from './user.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthJWTGuard } from 'src/shared/authJWT.guard';
import { User } from 'src/user/user.decorator'

@Controller()
export class UserController {

    constructor (private userService: UserService) {

    }

    @Post('login')
    @UsePipes (new ValidationPipe())
    login (@Body() data: UserCredentialsDTO){
        return this.userService.login(data);
    }

    @Post('changePassword')
    @UsePipes (new ValidationPipe())
    @UseGuards(new AuthJWTGuard()) 
    changePassword (@User('id') userId: string, @Body() data) {
        const {oldPassword, newPassword, newPasswordRepeated} = data;
        
        if (userId && oldPassword && newPassword && newPasswordRepeated) {
            if (newPassword === newPasswordRepeated){
                return this.userService.changePassword(userId, true , newPassword, oldPassword);
            } else {
                throw new HttpException ('Password and Repeated Password are not the same', HttpStatus.BAD_REQUEST);
            }

        } else{
            throw new HttpException ('Some data is missign', HttpStatus.BAD_REQUEST);
        }
    }


    @Get('api/users')
    @UseGuards(new AuthJWTGuard()) 
    showAllUsers() {
        return this.userService.showAllUsers();
    }

    @Get('api/users/:id')
    @UseGuards(new AuthJWTGuard()) 
    getUser(@Param('id') userId: string) {
        return this.userService.getUser(userId);
    }

    @Post('api/users')
    @UsePipes (new ValidationPipe())
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({ resource: 'users', action: 'create', possession: 'any'})
    create(@Body() data: UserDTO){
        return this.userService.create(data);
    }

    @Put('api/users/:id')
    @UsePipes (new ValidationPipe())
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({ resource: 'users', action: 'update', possession: 'any'}) 
    update(@Param('id') userId, @Body() data: UserUpdatableDTO){
        return this.userService.update(userId, data);
    }

    @Put('api/users/:id/changePassword')
    @UsePipes (new ValidationPipe())
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({ resource: 'users', action: 'update', possession: 'any'}) 
    changeUserPassword(@Param('id') userId, @Body() data){
        const {newPassword, newPasswordRepeated} = data;
        
        if (userId && newPassword && newPasswordRepeated) {
            if (newPassword === newPasswordRepeated){
                return this.userService.changePassword(userId, false, newPassword);
            } else {
                throw new HttpException ('Password and Repeated Password are not the same', HttpStatus.BAD_REQUEST);
            }

        } else{
            throw new HttpException ('Some data is missign', HttpStatus.BAD_REQUEST);
        }
    }

    @Delete('api/users/:id')
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({resource: 'users', action: 'delete', possession: 'any'}) 
    delete(@Param('id') userId){
        return this.userService.delete(userId);
    }

    @Post('api/users/:id/roles')
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({ resource: 'users', action: 'update', possession: 'any'}) 
    grantRole (@Param('id') userId: string,@Body('roleId') roleId: string) {
        return this.userService.grantRole(userId, roleId);
    }

    @Delete('api/users/:id/roles/:roleId')
    @UseGuards(new AuthJWTGuard(), ACGuard) 
    @UseRoles({ resource: 'users', action: 'update', possession: 'any'}) 
    revokeRole (@Param('id') userId: string,@Param('roleId') roleId: string) {
        return this.userService.revokeRole(userId,roleId);
    }


}
