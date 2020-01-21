import { Injectable, UsePipes, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { UserDTO, UserRO, UserUpdatableDTO, UserCredentialsDTO } from './user.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly UserModel: Model <User>) {
       
    }

    async showAllUsers() {
        const users = await this.UserModel.find().exec();
        return users.map (user => user.toResponseObject(false));
    }

    async getUser(userId: string) {
        try {
            let user = await this.UserModel.findById (userId);
           
            if (!user) {
                throw new HttpException ('User doesn\'t', HttpStatus.BAD_REQUEST);
            }
            return user.toResponseObject(false);

        } catch (error) {
            throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST)
        }

    }

    async login (data: UserCredentialsDTO): Promise <UserRO> {
        const {username, password} = data;
        const user = await this.UserModel.findOne ({username: username}).exec();

        if (!user || !await user.comparePassword(password)) {
            throw new HttpException ('Invalid Username or password', HttpStatus.BAD_REQUEST);
        } else {
            Logger.log (`User "${user.username}" has logged in`);
        }

        return user.toResponseObject(true);
    }
    
    async create (data: UserDTO): Promise <UserRO> {
        const {username, password, email, name} = data;
        let user = await this.UserModel.findOne ({where: {username}});

        if (user) {
            throw new HttpException ('Username already exists', HttpStatus.BAD_REQUEST);
        }

        user = await new this.UserModel({username, password, email, name});
       
        try {
            await user.save();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(true)
    }

    async update (id: string, data: Partial<UserUpdatableDTO>): Promise <UserRO> {
        
        try {
            let user = await this.UserModel.findById (id);

            if (!user) {
                throw new HttpException ('User doesn\'t', HttpStatus.BAD_REQUEST);
            }
    
            //Filter which fields can be updated
            if (data.name) {
                user.name = data.name;
            }
    
            if (data.email) {
                user.email = data.email;
            }
    
            try{ //Lets be a little more specific with the save errors output
                await user.save();
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
    
            return user.toResponseObject(true)
        
        } catch (error) {
            throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST)
        }
        
    }

    async delete (id: string): Promise <any> {
        try { 
            let user = await this.UserModel.findById (id);
            console.log ("user", user);
            await user.remove();
            return {deleted: true};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async changePassword(userId: string, oldPassowrd: string, newPassword: string): Promise <UserRO> {
        const user = await this.UserModel.findById (userId);

        if (!user || !await user.comparePassword(oldPassowrd)) {
            throw new HttpException ('Invalid Username or password', HttpStatus.BAD_REQUEST);
        } else {
            user.password = newPassword;
            try {
                await user.save();
                return user.toResponseObject(true);
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
        }
    }
}
