import {createParamDecorator } from '@nestjs/common';

export const Group = createParamDecorator ((data: string, req) => {
    return data ? req.group[data] : req.group;
})
