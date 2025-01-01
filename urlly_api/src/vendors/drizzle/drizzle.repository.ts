import type {
  Table,
  InferSelectModel,
  InferInsertModel,
  SQL,
} from 'drizzle-orm';
import { Injectable } from '@nestjs/common';
import type { DrizzleClientDatabase, InferValueType } from './interfaces';
import { InjectClient } from './decorators/inject-client.decorator';

@Injectable()
export class DrizzleRepository<TEntity extends Table> {
  constructor(
    @InjectClient()
    private readonly _client: DrizzleClientDatabase<Record<string, TEntity>>,
    private readonly entity: TEntity,
  ) {}

  public get client(): Readonly<typeof this._client> {
    return this._client;
  }

  public select(): Promise<InferSelectModel<TEntity>[]>;
  public select<TSelect>(
    select: TSelect,
  ): Promise<{ [K in keyof TSelect]: InferValueType<TSelect[K]> }>;
  public select<TSelect>(select?: TSelect) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this._client.select(select).from(this.entity);
  }

  public insert<TInsert extends InferInsertModel<TEntity>>(
    values: TInsert,
  ): Promise<InferSelectModel<TEntity>>;
  public insert<TInsert extends InferInsertModel<TEntity>>(
    values: TInsert[],
  ): Promise<InferSelectModel<TEntity>[]>;
  public insert<TInsert extends InferInsertModel<TEntity>>(
    values: TInsert | TInsert[],
  ): Promise<InferSelectModel<TEntity> | InferSelectModel<TEntity>[]> {
    return this._client
      .insert(this.entity)
      .values(values as TInsert)
      .returning() as unknown as Promise<
      InferSelectModel<TEntity> | InferSelectModel<TEntity>[]
    >;
  }

  public update<TUpdate extends Partial<InferInsertModel<TEntity>>>(
    set: TUpdate,
    where: SQL<unknown>,
  ): Promise<InferSelectModel<TEntity>>;
  public update<TUpdate extends Partial<InferInsertModel<TEntity>>>(
    set: TUpdate,
    where: SQL<unknown>[],
  ): Promise<InferSelectModel<TEntity>[]>;
  public update<TUpdate extends Partial<InferInsertModel<TEntity>>>(
    set: TUpdate,
    where: SQL<unknown> | SQL<unknown>[],
  ): Promise<InferSelectModel<TEntity> | InferSelectModel<TEntity>[]> {
    return this._client
      .update(this.entity)
      .set(set)
      .where(where as SQL<unknown>)
      .returning() as unknown as Promise<
      InferSelectModel<TEntity> | InferSelectModel<TEntity>[]
    >;
  }

  public delete(where: SQL<unknown>): Promise<InferSelectModel<TEntity>>;
  public delete(where: SQL<unknown>[]): Promise<InferSelectModel<TEntity>[]>;
  public delete(
    where: SQL<unknown> | SQL<unknown>[],
  ): Promise<InferSelectModel<TEntity> | InferSelectModel<TEntity>[]> {
    return this._client
      .delete(this.entity)
      .where(where as SQL<unknown>)
      .returning() as unknown as Promise<
      InferSelectModel<TEntity> | InferSelectModel<TEntity>[]
    >;
  }
}
