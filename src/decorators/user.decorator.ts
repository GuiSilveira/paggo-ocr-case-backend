import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';

export interface UserPayload {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: number;
}

export const User = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UserPayload }>();

    if (!request.user) {
      throw new NotFoundException('User not found');
    }

    if (filter) {
      return request.user[filter] as UserPayload[keyof UserPayload];
    }

    return request.user;
  },
);
