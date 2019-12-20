import { createParamDecorator } from '@nestjs/common';

export const Usr = createParamDecorator((_data, req) => req.user);
