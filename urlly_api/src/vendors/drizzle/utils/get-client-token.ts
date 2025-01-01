import { DEFAULT_CLIENT_TOKEN } from '../drizzle.constants';

export const getClientToken = (name: string = DEFAULT_CLIENT_TOKEN) => {
  return `drizzle_client:${name}`;
};
