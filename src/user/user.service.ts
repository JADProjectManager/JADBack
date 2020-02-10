import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
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

    async getUserByUsername(username: string) {
        try {
            let user = await this.UserModel.findOne({username});
           
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
        const roles: string[] = ["BASIC_USER"];

        let user = await this.UserModel.findOne ({where: {username}});

        if (user) {
            throw new HttpException ('Username already exists', HttpStatus.BAD_REQUEST);
        }

        user = await new this.UserModel({username, password, email, name, roles});
       
        try {
            await user.save();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(true)
    }

    async update (id: string, data: Partial<UserUpdatableDTO>): Promise <UserRO> {
        
        try{ 
            const {email, name} = data;
            const user = await this.UserModel.findByIdAndUpdate(
                {_id: id}, 
                {email, name}, 
                {new: true, omitUndefined: true});
            
            if (!user) {
                throw new HttpException ('User doesn\'t', HttpStatus.BAD_REQUEST);
            }

            return user.toResponseObject(true)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
        
    }

    async delete (id: string): Promise <any> {
        try { 
            let user = await this.UserModel.findById (id);
            await user.remove();
            return {deleted: true};
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async changePassword(userId: string, checkOldPassword: boolean, newPassword: string, oldPassowrd?: string): Promise <UserRO> {
        const user = await this.UserModel.findById (userId);

        if  (!user || (checkOldPassword && !await user.comparePassword(oldPassowrd))) {
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

    async grantRole (userId: string, roleId: string): Promise <UserRO> {
        const user = await this.UserModel.findById (userId);

        if (!user) {
            throw new HttpException ('Invalid user', HttpStatus.BAD_REQUEST);
        } else {
            let roles: string [] = user.roles.filter (role => {return role !== roleId})
            roles.push (roleId);
            user.roles = roles;
            try {
                await user.save();
                return user.toResponseObject(true);
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
        }
    }

    async revokeRole (userId: string, roleId): Promise <UserRO> {
        const user = await this.UserModel.findById (userId);

        if (!user) {
            throw new HttpException ('Invalid user', HttpStatus.BAD_REQUEST);
        } else {
            const roles: string [] = user.roles.filter (role => {return role !== roleId})
            user.roles = roles;
            try {
                await user.save();
                return user.toResponseObject(true);
            } catch (error) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
        }
    }

    async createDefaultData () {
        let user = await this.UserModel.findOne ({username: 'admin'}).exec();
      
        if (!user) {
            const roles: string[] = ["USERS_ADMINISTRATOR"];

            user = await new this.UserModel({ 
                username:'admin', 
                password: 'admin', 
                email: 'admin@example.com', 
                name: 'The admin', 
                roles});
       
            try {
                await user.save();
                Logger.log ('Admin User has been created: admin');
            } catch (error) {
                Logger.error ('Error creating the admin user');
            } 
        }
    }


}
