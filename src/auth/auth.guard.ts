import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const decoded = jwt.verify(
        token,
        "mysecuritykey",
      ) as jwt.JwtPayload;

      if (!decoded || !decoded.id) {
        throw new UnauthorizedException('Token payload missing user ID');
      }
      req['user'] = {
        id: decoded.id as string,
        email: decoded.email as string,
        role: decoded.role as string,
      };

      return true;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      } else {
        console.error('JWT verification unknown error:', err);
        throw new UnauthorizedException('Token verification failed');
      }
    }
  }
}
