import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService, JwtPayload } from 'src/auth/auth.service';
import { UserPayload } from 'src/decorators/user.decorator';
import { UserService } from 'src/user/user.service';

interface AuthenticatedRequest extends Request {
  tokenPayload?: JwtPayload; // Defina o que tem no token
  user?: UserPayload | null;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context
      .switchToHttp()
      .getRequest<Request & AuthenticatedRequest>();
    const { authorization } = request.headers;

    try {
      const payload = this.authService.verifyToken(
        (authorization ?? '').split(' ')[1],
      );

      request.tokenPayload = payload;

      request.user = await this.userService.findOne(payload.id);

      return true;
    } catch {
      return false;
    }
  }
}
