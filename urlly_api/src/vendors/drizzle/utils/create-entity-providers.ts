import { Table } from 'drizzle-orm';
import { Provider } from '@nestjs/common';
import { DrizzleClientDatabase } from '../interfaces';
import { DrizzleRepository } from '../drizzle.repository';
import { getClientToken } from './get-client-token';
import { getEntityToken } from './get-entity-token';

export const createEntityProviders = (entities: Table[], name: string) =>
  entities.map((entity): { provider: Provider; token: string } => {
    const token = getEntityToken(entity);

    return {
      token,
      provider: {
        provide: getEntityToken(entity),
        useFactory: (
          drizzleClient: DrizzleClientDatabase<Record<string, typeof entity>>,
        ) => {
          return new DrizzleRepository(drizzleClient, entity);
        },
        inject: [getClientToken(name)],
      },
    };
  });
