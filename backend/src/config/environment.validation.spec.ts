import { validateEnvironment } from './environment.validation';

describe('validateEnvironment', () => {
  it('does not require production secrets outside production', () => {
    const environment = { NODE_ENV: 'test' };

    expect(validateEnvironment(environment)).toBe(environment);
  });

  it('rejects a production environment with missing variables', () => {
    expect(() =>
      validateEnvironment({
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://example',
        DIRECT_URL: '   ',
      }),
    ).toThrow(
      'Missing required production environment variables: DIRECT_URL, SUPABASE_JWT_SECRET, ALLOWED_ORIGINS',
    );
  });

  it('accepts a complete production environment', () => {
    const environment = {
      NODE_ENV: 'production',
      DATABASE_URL: 'postgresql://pooled',
      DIRECT_URL: 'postgresql://direct',
      SUPABASE_JWT_SECRET: 'secret',
      ALLOWED_ORIGINS: 'https://ielts-simulator.vercel.app',
    };

    expect(validateEnvironment(environment)).toBe(environment);
  });
});
