import { ConfigType, registerAs } from '@nestjs/config';

const config = registerAs('host', () => ({
  host: process.env.HOST || 'localhost:3000',
  scheme: process.env.SCHEME || 'http',
}));

export default config;

export type HostConfig = ConfigType<typeof config>;
