import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { Config } from '@libsql/client';
import { AnyColumn, Placeholder, SQL } from 'drizzle-orm';

type DrizzleSchemaOption = {
  schema: Record<string, unknown>;
};

export type DrizzleDatabaseOptions = DrizzleSchemaOption & Config;

export type DrizzleSqliteOptions = { type: 'sqlite' } & DrizzleDatabaseOptions;

export type DrizzleBetterSqliteOptions = {
  type: 'better-sqlite3';
} & DrizzleDatabaseOptions;

export type DrizzleModuleOptions =
  | DrizzleSqliteOptions
  | DrizzleBetterSqliteOptions;

export type DrizzleClientDatabase<T extends Record<string, unknown>> =
  | LibSQLDatabase<T>
  | BetterSQLite3Database<T>;

export type InferInsertValue<T> = {
  [K in keyof T]: SQL<unknown> | Placeholder<string, any> | T[K];
};

export type InferValueType<T> =
  T extends AnyColumn<infer U> ? U['data'] : T extends SQL<infer V> ? V : T;
