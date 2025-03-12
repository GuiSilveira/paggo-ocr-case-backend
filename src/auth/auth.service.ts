import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

export interface JwtPayload {
  id: number;
  sub: string;
  name: string;
  email: string;
  role?: string;
  exp?: number;
}

@Injectable()
export class AuthService {
  private issuer = 'paggo-backend-login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}

  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        {
          expiresIn: '7d',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  verifyToken(token: string) {
    try {
      const data = this.jwtService.verify<JwtPayload>(token, {
        issuer: this.issuer,
        audience: this.audience,
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string) {
    try {
      this.verifyToken(token);

      return true;
    } catch {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);

    return this.createToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email not found');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: String(user.id),
        issuer: 'forgot-password',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      to: email,
      subject: 'Reset your password',
      template: './forgot-password',
      context: {
        name: user.name,
        token,
      },
    });

    return true;
  }

  async resetPassword(password: string, token: string) {
    try {
      const data = this.jwtService.verify<JwtPayload>(token, {
        issuer: 'forgot-password',
        audience: 'users',
      });

      if (!data.id) {
        throw new BadRequestException('Invalid token');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await this.userService.updatePartial(data.id, {
        password: hashedPassword,
      });

      return this.createToken(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
