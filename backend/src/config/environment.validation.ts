const REQUIRED_PRODUCTION_VARIABLES = [
  'DATABASE_URL',
  'DIRECT_URL',
  'SUPABASE_JWT_SECRET',
  'ALLOWED_ORIGINS',
] as const;

export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  if (environment.NODE_ENV !== 'production') {
    return environment;
  }

  const missingVariables = REQUIRED_PRODUCTION_VARIABLES.filter((name) => {
    const value = environment[name];
    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missingVariables.join(', ')}`,
    );
  }

  return environment;
}
