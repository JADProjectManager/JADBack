import { Controller, Post, Get, Body, UsePipes, UseGuards, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO, UserUpdatableDTO, UserCredentialsDTO } from './user.dto';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { AuthGuard } from 'src/shared/auth.guard';
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
    @UseGuards(new AuthGuard()) 
    changePassword (@User('id') userId: string, @Body() data) {
        const {oldpassword, newpassword, newpasswordrepeated} = data;
        
        if (userId && oldpassword && newpassword && newpasswordrepeated) {
            if (newpassword === newpasswordrepeated){
                return this.userService.changePassword(userId,oldpassword,newpassword);
            } else {
                throw new HttpException ('Password and Repeated Password are not the same', HttpStatus.BAD_REQUEST);
            }

        } else{
            throw new HttpException ('Some data is missign', HttpStatus.BAD_REQUEST);
        }
    }


    @Get('api/users')
    @UseGuards(new AuthGuard()) 
    showAllUsers() {
        return this.userService.showAllUsers();
    }

    @Get('api/users/:id')
    @UseGuards(new AuthGuard()) 
    getUser(@Param('id') userId: string) {
        return this.userService.getUser(userId);
    }

    @Post('api/users')
    @UsePipes (new ValidationPipe())
    create(@Body() data: UserDTO){
        return this.userService.create(data);
    }

    @Put('api/users/:id')
    @UsePipes (new ValidationPipe())
    update(@Param('id') id, @Body() data: UserUpdatableDTO){
        return this.userService.update(id, data);
    }

    @Delete('api/users/:id')
    delete(@Param('id') id){
        return this.userService.delete(id);
    }

}
