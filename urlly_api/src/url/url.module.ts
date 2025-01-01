import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { DrizzleModule } from '../vendors/drizzle/drizzle.module';
import { urls } from '../database/url.entity';

@Module({
  imports: [DrizzleModule.forFeature({ entities: [urls] })],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
