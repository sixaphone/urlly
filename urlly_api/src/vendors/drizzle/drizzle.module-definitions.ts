import { ConfigurableModuleBuilder } from '@nestjs/common';
import type { DrizzleModuleOptions } from './interfaces';

export const {
  ConfigurableModuleClass: ConfigurableDrizzleModule,
  MODULE_OPTIONS_TOKEN: DRIZZLE_OPTIONS_TOKEN,
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<DrizzleModuleOptions>()
  .setClassMethodName('forRoot')
  .setExtras(
    {
      isGlobal: true,
      name: 'default',
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
      name: extras.name,
    }),
  )
  .build();
