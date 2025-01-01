import { drizzle as drizzleSqlite } from 'drizzle-orm/libsql';
import { drizzle as drizzleBetterSqlite3 } from 'drizzle-orm/better-sqlite3';
import { DRIZZLE_OPTIONS_TOKEN } from '../drizzle.module-definitions';
import type {
  DrizzleClientDatabase,
  DrizzleModuleOptions,
} from '../interfaces';
import { getClientToken } from './get-client-token';

export const createProviders = (name?: string) => [
  {
    provide: getClientToken(name),
    useFactory: (
      options: DrizzleModuleOptions,
    ): DrizzleClientDatabase<typeof options.schema> => {
      const { type, schema, ...connection } = options;

      switch (type) {
        case 'sqlite': {
          return drizzleSqlite({
            schema,
            connection,
          });
        }
        case 'better-sqlite3': {
          return drizzleBetterSqlite3({
            schema,
            connection,
          });
        }
      }
    },
    inject: [DRIZZLE_OPTIONS_TOKEN],
  },
];
