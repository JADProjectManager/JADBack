<<<<<<< HEAD
import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";
=======
import { IsNotEmpty, IsEmail } from "class-validator";
>>>>>>> 5d739a4131236e435e3331d2febd0186e62b6c66

export class UserDTO{

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsEmail ()
    email: string;

    @IsOptional()
    name: string;
}

export class UserCredentialsDTO {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}

export class UserUpdatableDTO {
    @IsOptional()
    @IsEmail ()
    email: string;

    @IsOptional()
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