import {} from '@nestjs/common'
import  * as bcrypt from 'bcryptjs';
import  * as jwt from 'jsonwebtoken';
import { UserRO } from './user.dto';
import * as mongoose from 'mongoose';
import 'dotenv/config';
import * as _ from 'underscore';

/**
 * Getter
 */

const escapeProperty = (value: string): string  => {
    return _.escape(value);
};

const passwordIsNotEmpty = (password) => {
    return (password && password.length)
};

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        get: escapeProperty
    },
    hashed_password: {
        type: String,
        validate: [passwordIsNotEmpty, 'Password cannot be empty']
    },
    name: String,
    email: {
        type: String,
        unique: true
    },    
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
});

  

// Virtuals
UserSchema
    .virtual('password')
    // set methods
    .set(function (password) {
        this._password = password;
    });

UserSchema.pre("save", function (next) {
    // store reference
    const user = this;
    if (user._password === undefined) {
        return next();
    }

    //Refresh the updated date
    user.updated = new Date();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) console.log(err);
        // hash the password using our new salt
        bcrypt.hash(user._password, salt, function (err, hash) {
            if (err) console.log(err);
            user.hashed_password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = async function (attemptedPassword: string) {
    return await bcrypt.compare (attemptedPassword, this.hashed_password); 
}

UserSchema.methods.toResponseObject = function (showToken: boolean): UserRO {
    const {id, username, email, name,  created, updated} = this;
    
    let responseObject: any = {id , username, name, email, created, updated};


    if (showToken) {
        let token = this.token();
        responseObject =  {...responseObject, token };
    }

    return responseObject;
};

UserSchema.methods.token = function () {
    const {id, username} = this;
    return jwt.sign ({
        id,
        username
    },
    process.env.SECRET,
    {expiresIn: '7d'});
};

export interface User {
    username: string;
    name: string;
    password: string;
    email: string;
    created: Date;
    updated: Date;
}