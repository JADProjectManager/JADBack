import { IsNotEmpty, IsEmail } from "class-validator";

export class UserDTO{

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsEmail ()
    email: string;

    name: string;
}

export class UserRO {
    id: string;
    username: string;
    email: string;
    name: string;
    created: Date;
    updated: Date;
}