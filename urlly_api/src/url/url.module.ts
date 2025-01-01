import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { DrizzleModule } from '../vendors/drizzle/drizzle.module';
import { urls } from '../database/url.entity';
import { ConfigModule } from '@nestjs/config';
import hostConfig from '../config/host.config';

@Module({
  imports: [
    ConfigModule.forFeature(hostConfig),
    DrizzleModule.forFeature({ entities: [urls] }),
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
