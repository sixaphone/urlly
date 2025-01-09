import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { urls } from '../database/url.entity';
import { Schema } from '../database/schema';
import { RetryWrapper } from '../retry.wrapper';
import { eq } from 'drizzle-orm';
import { SlugService } from '../slug.service';
import hostConfig, { type HostConfig } from '../config/host.config';
import {
  DrizzleDatabase,
  DrizzleRepository,
  InjectClient,
  InjectRepository,
} from '@sixaphone/nestjs-drizzle';

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

      return `${this.config.scheme}://${this.config.host}/${response.slug}`;
    } catch (error) {
      throw new ConflictException('Unable to shorten url', { cause: error });
    }
  }
}
