import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthForgotPasswordDTO } from './dto/auth-forgot-password.dto';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthResetPasswordDTO } from './dto/auth-reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: AuthLoginDTO) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() data: AuthRegisterDTO) {
    return this.authService.register(data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: AuthForgotPasswordDTO) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() { password, token }: AuthResetPasswordDTO) {
    return this.authService.resetPassword(password, token);
  }
}
