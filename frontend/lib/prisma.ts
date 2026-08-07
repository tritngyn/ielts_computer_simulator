import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  let url = process.env.DATABASE_URL;
  // Tự động thêm pgbouncer=true nếu dùng Supabase Pooler (port 6543) mà quên thêm
  if (url && url.includes('6543') && !url.includes('pgbouncer=true')) {
    url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
  }

  return new PrismaClient({
    ...(url && {
      datasources: {
        db: {
          url: url,
        },
      },
    }),
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
