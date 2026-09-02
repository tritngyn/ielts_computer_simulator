import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { SupabaseJwtClaims } from './supabase-user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SupabaseJwtClaims => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user as SupabaseJwtClaims;
  },
);
