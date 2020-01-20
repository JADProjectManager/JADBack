import {createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator ((data: string, req) => {
    return data ? req.user[data] : req.user;
})
