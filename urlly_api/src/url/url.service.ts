import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { urls } from '../database/url.entity';
import { InjectClient } from '../vendors/drizzle/decorators/inject-client.decorator';
import { Schema } from '../database/schema';
import { InjectRepository } from '../vendors/drizzle/decorators/inject-repository.decorator';
import { DrizzleRepository } from '../vendors/drizzle/drizzle.repository';
import { RetryWrapper } from '../retry.wrapper';
import { eq } from 'drizzle-orm';
import { DrizzleDatabase } from '../vendors/drizzle/interfaces';
import { SlugService } from '../slug.service';
import hostConfig, { type HostConfig } from '../config/host.config';

@Injectable()
export class UrlService {
  constructor(
    @InjectClient()
    private readonly drizzle: DrizzleDatabase<'sqlite', Schema>,
    @InjectRepository(urls)
    private readonly urlRepo: DrizzleRepository<Schema, 'urls', 'sqlite'>,
    @Inject(hostConfig.KEY)
    private readonly config: HostConfig,
  ) {}

  public async shorten(url: string) {
    return this._save(url, SlugService.short());
  }

  public lengthen(url: string) {
    return this._save(url, SlugService.long());
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

  private async _save(url: string, slug: string) {
    const retry = new RetryWrapper(() => {
      return this.drizzle.transaction((tx) => {
        return tx
          .insert(urls)
          .values({
            target: url,
            slug,
          })
          .returning();
      });
    });

    try {
      const [response] = await retry.execute();

      return `${this.config.scheme}://${this.config.host}:${this.config.port}/${response.slug}`;
    } catch (error) {
      throw new ConflictException('Unable to shorten url', { cause: error });
    }
  }
}
