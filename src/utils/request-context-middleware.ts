import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestContextService } from './request-context-service';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly requestContext: RequestContextService,
    private userService: UsersService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = this.jwtService.verify(token, {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        });

        if (payload) {
          const user = await this.userService.findById(payload.id);
          (req as any).currentUser = user;
          this.requestContext.set('user', user);
        }
      }
    } catch (error) {
      console.log(error);
    }
    next();
  }
}
