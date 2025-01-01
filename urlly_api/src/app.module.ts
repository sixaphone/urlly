import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';
import databaseConfig, { type DatabaseConfig } from './config/database.config';
import { DrizzleModule } from './vendors/drizzle/drizzle.module';
import { schema } from './database/schema';

@Module({
  imports: [
    DrizzleModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (config: DatabaseConfig) => {
        if (config.useTurso) {
          return {
            type: 'sqlite',
            url: config.url,
            authToken: config.authToken,
            schema,
          };
        }

        return {
          schema,
          type: 'sqlite',
          url: config.url,
        };
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UrlModule,
  ],
})
export class AppModule {}
