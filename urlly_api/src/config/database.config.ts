import { ConfigType, registerAs } from '@nestjs/config';

const config = registerAs('database', () => ({
  useTurso: process.env.USE_TURSO === 'true',
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
}));

export default config;

export type DatabaseConfig = ConfigType<typeof config>;
