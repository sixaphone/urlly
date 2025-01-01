import { Table } from 'drizzle-orm';
import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigurableDrizzleModule,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} from './drizzle.module-definitions';
import { createProviders } from './utils/create-providers';
import { getClientToken } from './utils/get-client-token';
import { createEntityProviders } from './utils/create-entity-providers';
import { DEFAULT_CLIENT_TOKEN } from './drizzle.constants';

@Module({})
export class DrizzleModule extends ConfigurableDrizzleModule {
  static forRoot(options: typeof OPTIONS_TYPE) {
    const root = super.forRootAsync(options);
    const providers = createProviders(options.name);

    return {
      ...root,
      providers: [...root.providers, ...providers],
      exports: [...(root.exports ?? []), getClientToken(options.name)],
    };
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    const root = super.forRootAsync(options);
    const providers = createProviders(options.name);
    return {
      ...root,
      providers: [...root.providers, ...providers],
      exports: [...(root.exports ?? []), getClientToken(options.name)],
    };
  }

  static forFeature({ entities, name }: { entities: Table[]; name?: string }) {
    const entityProviders = createEntityProviders(
      entities,
      name || DEFAULT_CLIENT_TOKEN,
    );
    return {
      module: DrizzleModule,
      providers: entityProviders.map(({ provider }) => provider),
      exports: entityProviders.map(({ token }) => token),
    };
  }
}
