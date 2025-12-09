import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// guard để bảo vệ routes
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
