import { Injectable, NotFoundException } from '@nestjs/common';
import { urls } from '../database/url.entity';
import { InjectClient } from '../vendors/drizzle/decorators/inject-client.decorator';
import { Schema } from '../database/schema';
import { InjectRepository } from '../vendors/drizzle/decorators/inject-repository.decorator';
import { DrizzleRepository } from '../vendors/drizzle/drizzle.repository';
import { RetryWrapper } from '../retry.wrapper';
import { eq } from 'drizzle-orm';
import { DrizzleDatabase } from 'src/vendors/drizzle/interfaces';
import { SlugService } from 'src/slug.service';

@Injectable()
export class UrlService {
  constructor(
    @InjectClient()
    private readonly drizzle: DrizzleDatabase<'sqlite', Schema>,
    @InjectRepository(urls)
    private readonly urlRepo: DrizzleRepository<Schema, 'urls', 'sqlite'>,
  ) {}

  public async shorten(url: string) {
    const retry = new RetryWrapper(() => {
      return this.drizzle.transaction((tx) => {
        return tx
          .insert(urls)
          .values({
            target: url,
            slug: SlugService.short(),
          })
          .returning();
      });
    });

    return retry.execute();
  }

  public async lengthen(url: string) {
    const retry = new RetryWrapper(() => {
      return this.drizzle.transaction((tx) => {
        return tx
          .insert(urls)
          .values({
            target: url,
            slug: SlugService.long(),
          })
          .returning();
      });
    });

    return retry.execute();
  }

  public async getUrlBySlug(slug: string) {
    const [target] = await this.urlRepo.selectWhere(eq(urls.slug, slug), {
      id: urls.id,
      target: urls.target,
    });

    if (!target) {
      throw new NotFoundException();
    }

    return target;
  }
}
