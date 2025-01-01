import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql';
import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3';
import { createClient } from '@libsql/client';
import type { DrizzleModuleOptions, DrizzleDatabase } from '../interfaces';
import { DRIZZLE_OPTIONS_TOKEN } from '../drizzle.module-definitions';
import { getClientToken } from './get-client-token';

export const createProviders = (name?: string) => [
  {
    provide: getClientToken(name),
    useFactory: (
      options: DrizzleModuleOptions,
    ): DrizzleDatabase<typeof options.type, typeof options.schema> => {
      const { type, schema, ...connectionConfig } = options;

      switch (type) {
        case 'sqlite': {
          const client = createClient(connectionConfig);
          return drizzleSqlite(client, { schema }) as DrizzleDatabase<
            typeof options.type,
            typeof options.schema
          >;
        }
        case 'better-sqlite3': {
          return drizzleBetterSqlite3(connectionConfig, {
            schema,
          }) as DrizzleDatabase<typeof options.type, typeof options.schema>;
        }
        default: {
          throw new Error(`Unsupported database type: ${type}`);
        }
      }
    },
    inject: [DRIZZLE_OPTIONS_TOKEN],
  },
];
