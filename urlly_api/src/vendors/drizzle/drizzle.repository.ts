import type {
  Table,
  InferInsertModel,
  InferSelectModel,
  SQL,
} from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import type {
  DrizzleDatabaseType,
  DrizzleDatabase,
  DrizzleInsert,
  DrizzleUpdate,
  DrizzleSelectResult,
  InferValueType,
} from './interfaces';

@Injectable()
export class DrizzleRepository<
  TSchema extends Record<string, Table>,
  TTable extends keyof TSchema,
  TType extends DrizzleDatabaseType,
  TEntity extends Table = TSchema[TTable],
> {
  constructor(
    private readonly _client: DrizzleDatabase<TType, TSchema>,
    private readonly entity: TEntity,
  ) {}

  public get client(): DrizzleDatabase<TType, TSchema> {
    return this._client;
  }

  public select(): DrizzleSelectResult<
    TType,
    TTable & string,
    InferSelectModel<TEntity>
  >;
  public select<TSelect extends Record<string, unknown>>(
    select: TSelect,
  ): DrizzleSelectResult<
    TType,
    TTable & string,
    {
      [K in keyof TSelect]: TSelect[K] extends SQL<infer U>
        ? U
        : InferValueType<TSelect[K]>;
    }
  >;
  public select<TSelect extends Record<string, unknown>>(select?: TSelect) {
    // @ts-expect-error - error is due to ts incompatibility with types but they are in fact not a problem
    const query = this._client.select(select).from(this.entity);
    return query as DrizzleSelectResult<
      TType,
      TTable & string,
      TSelect extends Record<string, unknown>
        ? {
            [K in keyof TSelect]: TSelect[K] extends SQL<infer U>
              ? U
              : InferValueType<TSelect[K]>;
          }
        : InferSelectModel<TEntity>
    >;
  }

  public selectWhere(
    where: SQL<unknown>,
  ): DrizzleSelectResult<TType, TTable & string, InferSelectModel<TEntity>>;
  public selectWhere<TSelect extends Record<string, unknown>>(
    where: SQL<unknown>,
    select: TSelect,
  ): DrizzleSelectResult<
    TType,
    TTable & string,
    {
      [K in keyof TSelect]: TSelect[K] extends SQL<infer U>
        ? U
        : InferValueType<TSelect[K]>;
    }
  >;
  public selectWhere<TSelect extends Record<string, unknown>>(
    where: SQL<unknown>,
    select?: TSelect,
  ) {
    // @ts-expect-error - error is due to ts incompatibility with types but they are in fact not a problem
    const query = this._client.select(select).from(this.entity).where(where);
    return query as DrizzleSelectResult<
      TType,
      TTable & string,
      TSelect extends Record<string, unknown>
        ? {
            [K in keyof TSelect]: TSelect[K] extends SQL<infer U>
              ? U
              : InferValueType<TSelect[K]>;
          }
        : InferSelectModel<TEntity>
    >;
  }

  public insert<TInsert extends InferInsertModel<TEntity>>(
    values: TInsert,
  ): DrizzleInsert<TType, TEntity, TInsert>;
  public insert<TInsert extends InferInsertModel<TEntity>>(
    values: TInsert[],
  ): DrizzleInsert<TType, TEntity, TInsert[]>;
  public insert<TInsert extends InferInsertModel<TEntity>>(
    values: TInsert | TInsert[],
  ) {
    // @ts-expect-error - error is due to ts incompatibility with types but they are in fact not a problem
    return this._client.insert(this.entity).values(values as TInsert);
  }

  public update<TUpdate extends Partial<InferInsertModel<TEntity>>>(
    values: TUpdate,
  ): DrizzleUpdate<TType, TEntity, TUpdate>;
  public update<TUpdate extends Partial<InferInsertModel<TEntity>>>(
    values: TUpdate,
  ) {
    // @ts-expect-error - error is due to ts incompatibility with types but they are in fact not a problem
    return this._client.update(this.entity).set(values);
  }

  public updateWhere<TUpdate extends Partial<InferInsertModel<TEntity>>>(
    where: SQL<unknown>,
    values: TUpdate,
  ): DrizzleUpdate<TType, TEntity, TUpdate>;
  public updateWhere<TUpdate extends Partial<InferInsertModel<TEntity>>>(
    where: SQL<unknown>,
    values: TUpdate,
  ) {
    // @ts-expect-error - error is due to ts incompatibility with types but they are in fact not a problem
    return this._client.update(this.entity).set(values).where(where);
  }

  public delete(): ReturnType<typeof this._client.delete>;
  public delete() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // @ts-expect-error - This is a valid return type
    return this._client.delete(this.entity);
  }

  public deleteWhere(
    where: SQL<unknown>,
  ): ReturnType<typeof this._client.delete>;
  public deleteWhere(where: SQL<unknown>) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // @ts-expect-error - This is a valid return type
    return this._client.delete(this.entity).where(where);
  }
}
