import {createParamDecorator } from '@nestjs/common';

export const ProjectRequest = createParamDecorator ((data: string, req) => {
    return data ? req.projectRequest[data] : req.projectRequest;
})
