import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { urls } from '../database/url.entity';
import { ConfigModule } from '@nestjs/config';
import hostConfig from '../config/host.config';
import { DrizzleModule } from '@sixaphone/nestjs-drizzle';

@Module({
  imports: [
    ConfigModule.forFeature(hostConfig),
    DrizzleModule.forFeature({ entities: [urls] }),
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
