import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { SupabaseJwtClaims } from '../common/auth/supabase-user';

@Injectable()
export class SupabaseGuard extends AuthGuard('supabase') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = SupabaseJwtClaims>(
    err: Error | null,
    user: TUser | false,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Missing or invalid Supabase JWT');
    }
    return user;
  }
}
