import { ConfigType, registerAs } from '@nestjs/config';

const config = registerAs('host', () => ({
  host: process.env.HOST || 'localhost',
  scheme: process.env.SCHEME || 'http',
  port: process.env.HOST_PORT || 3001,
}));

export default config;

export type HostConfig = ConfigType<typeof config>;
