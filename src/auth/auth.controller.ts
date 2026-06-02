import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.auth.login(dto.username, dto.password);
    response.setHeader('Set-Cookie', this.auth.createCookie(result.token));
    return result.user;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.setHeader('Set-Cookie', this.auth.clearCookie());
    return { loggedOut: true };
  }

  @Get('me')
  me(@Req() request: Request) {
    const session = this.auth.verifyRequest(request.headers.cookie);
    return { id: session.sub, username: session.username };
  }
}
