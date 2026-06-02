import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';

interface SessionPayload {
  sub: number;
  username: string;
  exp: number;
}

@Injectable()
export class AuthService {
  readonly cookieName = 'purifreze_admin';

  constructor(private readonly prisma: PrismaService) {}

  async login(username: string, password: string) {
    const user = await this.prisma.adminUser.findUnique({
      where: { username: username.trim().toLowerCase() },
    });
    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos.');
    }
    return {
      token: this.sign({ sub: user.id, username: user.username }),
      user: { id: user.id, username: user.username },
    };
  }

  verifyRequest(cookieHeader?: string): SessionPayload {
    const token = this.readCookie(cookieHeader, this.cookieName);
    if (!token)
      throw new UnauthorizedException('Inicia sesión para continuar.');
    return this.verify(token);
  }

  createCookie(token: string): string {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const sameSite = process.env.NODE_ENV === 'production' ? 'None' : 'Strict';
    return `${this.cookieName}=${token}; HttpOnly; Path=/; SameSite=${sameSite}; Max-Age=28800${secure}`;
  }

  clearCookie(): string {
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
    const sameSite = process.env.NODE_ENV === 'production' ? 'None' : 'Strict';
    return `${this.cookieName}=; HttpOnly; Path=/; SameSite=${sameSite}; Max-Age=0${secure}`;
  }

  private sign(payload: Omit<SessionPayload, 'exp'>): string {
    const body = Buffer.from(
      JSON.stringify({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      }),
    ).toString('base64url');
    return `${body}.${this.signature(body)}`;
  }

  private verify(token: string): SessionPayload {
    const [body, signature] = token.split('.');
    if (!body || !signature)
      throw new UnauthorizedException('La sesión no es válida.');
    const expected = Buffer.from(this.signature(body));
    const actual = Buffer.from(signature);
    if (
      expected.length !== actual.length ||
      !timingSafeEqual(expected, actual)
    ) {
      throw new UnauthorizedException('La sesión no es válida.');
    }
    let payload: SessionPayload;
    try {
      payload = JSON.parse(
        Buffer.from(body, 'base64url').toString(),
      ) as SessionPayload;
    } catch {
      throw new UnauthorizedException('La sesiÃ³n no es vÃ¡lida.');
    }
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException('La sesión expiró.');
    }
    return payload;
  }

  private signature(body: string): string {
    const secret = process.env.AUTH_SECRET;
    if (!secret) throw new Error('AUTH_SECRET is required.');
    return createHmac('sha256', secret).update(body).digest('base64url');
  }

  private readCookie(header: string | undefined, name: string): string | null {
    const value = header
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${name}=`));
    return value ? decodeURIComponent(value.slice(name.length + 1)) : null;
  }
}
