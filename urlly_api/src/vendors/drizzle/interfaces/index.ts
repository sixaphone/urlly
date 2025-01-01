import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import type { Config } from '@libsql/client';
import type {
  AnyColumn,
  ColumnsSelection,
  Placeholder,
  SQL,
  Table,
} from 'drizzle-orm';
import type {
  SQLiteInsertBuilder,
  SQLiteSelect,
  SQLiteUpdateBuilder,
  SQLiteUpdateSetSource,
} from 'drizzle-orm/sqlite-core';
import type {
  PgInsertBuilder,
  PgQueryResultHKT,
  PgSelect,
  PgUpdateBuilder,
  PgUpdateSetSource,
} from 'drizzle-orm/pg-core';
import type {
  MySqlInsertBuilder,
  MySqlQueryResultHKT,
  MySqlSelect,
  MySqlTable,
  MySqlUpdateBuilder,
  MySqlUpdateSetSource,
  PreparedQueryHKTBase,
} from 'drizzle-orm/mysql-core';

export type DrizzleDatabaseType =
  | 'sqlite'
  | 'better-sqlite3'
  | 'postgres'
  | 'mysql';

export type DrizzleModuleOptions = {
  type: DrizzleDatabaseType;
  schema: Record<string, Table>;
} & Config;

export type DrizzleDatabase<
  TType extends DrizzleDatabaseType,
  TSchema extends Record<string, unknown>,
> = TType extends 'sqlite'
  ? LibSQLDatabase<TSchema>
  : TType extends 'better-sqlite3'
    ? BetterSQLite3Database<TSchema>
    : TType extends 'postgres'
      ? NodePgDatabase<TSchema>
      : TType extends 'mysql'
        ? MySql2Database<TSchema>
        : never;

export type InferInsertValue<T> = {
  [K in keyof T]: SQL<unknown> | Placeholder<string, any> | T[K];
};

export type InferValueType<T> =
  T extends AnyColumn<infer U> ? U['data'] : T extends SQL<infer V> ? V : T;

export type DrizzleSelect<
  TDatabase extends
    | LibSQLDatabase<any>
    | BetterSQLite3Database<any>
    | NodePgDatabase<any>
    | MySql2Database<any>,
  TTable extends string,
  TSelect extends Record<string, unknown>,
> = TDatabase extends LibSQLDatabase<any> | BetterSQLite3Database<any>
  ? SQLiteSelect<TTable, 'async', TSelect>
  : TDatabase extends NodePgDatabase<any>
    ? PgSelect<TTable, TSelect>
    : TDatabase extends MySql2Database<any>
      ? MySqlSelect<TTable, TSelect>
      : never;

export type DrizzleSelectResult<
  TType extends DrizzleDatabaseType,
  TTable extends string,
  TSelect,
> = TType extends 'sqlite' | 'better-sqlite3'
  ? SQLiteSelect<TTable, 'async', TSelect> & Promise<TSelect[]>
  : TType extends 'postgres'
    ? PgSelect<TTable, TSelect & ColumnsSelection> & Promise<TSelect[]>
    : TType extends 'mysql'
      ? MySqlSelect<TTable, TSelect & ColumnsSelection> & Promise<TSelect[]>
      : never;

export type DrizzleInsert<
  TType extends DrizzleDatabaseType,
  TEntity extends Table,
  TInsert,
> = TType extends 'sqlite' | 'better-sqlite3'
  ? ReturnType<
      SQLiteInsertBuilder<
        TEntity,
        TInsert extends any[] ? 'async' : 'sync',
        any
      >['values']
    >
  : TType extends 'postgres'
    ? ReturnType<PgInsertBuilder<TEntity, TInsert & PgQueryResultHKT>['values']>
    : TType extends 'mysql'
      ? ReturnType<
          MySqlInsertBuilder<
            TEntity & MySqlTable,
            TInsert & MySqlQueryResultHKT,
            PreparedQueryHKTBase
          >['values']
        >
      : never;

export type DrizzleUpdate<
  TType extends DrizzleDatabaseType,
  TEntity extends Table,
  TUpdate extends
    | SQLiteUpdateSetSource<TEntity>
    | PgUpdateSetSource<TEntity>
    | MySqlUpdateSetSource<TEntity & MySqlTable>,
> = TType extends 'sqlite' | 'better-sqlite3'
  ? ReturnType<SQLiteUpdateBuilder<TEntity, 'async', TUpdate>['set']>
  : TType extends 'postgres'
    ? ReturnType<PgUpdateBuilder<TEntity, TUpdate & PgQueryResultHKT>['set']>
    : TType extends 'mysql'
      ? ReturnType<
          MySqlUpdateBuilder<
            TEntity & MySqlTable,
            TUpdate & MySqlQueryResultHKT,
            PreparedQueryHKTBase
          >['set']
        >
      : never;
