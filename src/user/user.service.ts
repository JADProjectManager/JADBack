import { Injectable, UsePipes, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { UserDTO, UserRO } from './user.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly UserModel: Model <User>) {
       
    }

    async showAllUsers() {
        const users = await this.UserModel.find().exec();
        return users.map (user => user.toResponseObject(false));
    }

    async login (data: UserDTO): Promise <UserRO> {
        const {username, password} = data;
        const user = await this.UserModel.findOne ({username: username}).exec();

        if (!user || !await user.comparePassword(password)) {
            throw new HttpException ('Invalid Username or password', HttpStatus.BAD_REQUEST);
        } else {
            Logger.log (`User "${user.username}" has logged in`);
        }

        return user.toResponseObject(true);
    }
    
    async register (data: UserDTO): Promise <UserRO> {
        const {username, password} = data;
        let user = await this.UserModel.findOne ({where: {username}});

        if (user) {
            throw new HttpException ('Username already exists', HttpStatus.BAD_REQUEST);
        }

        user = await new this.UserModel(data);
        await user.save();

        return user.toResponseObject(true)
    }
}
