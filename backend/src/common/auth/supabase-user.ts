export interface SupabaseUserMetadata {
  avatar_url?: string;
  full_name?: string;
  [key: string]: unknown;
}

export interface SupabaseJwtClaims {
  sub: string;
  email?: string;
  user_metadata?: SupabaseUserMetadata;
  [key: string]: unknown;
}
