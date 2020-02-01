import { IsNotEmpty, IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'

export class UserDTO{

    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail ()
    email: string;

    @ApiProperty()
    @IsOptional()
    name: string;
}

export class UserCredentialsDTO {

    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}

export class UserUpdatableDTO {

    @ApiProperty()
    @IsOptional()
    @IsEmail ()
    email: string;

    @ApiProperty()
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