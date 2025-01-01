import { Injectable } from '@nestjs/common';
import { urls } from 'src/database/url.entity';
import { InjectClient } from 'src/vendors/drizzle/decorators/inject-client.decorator';
import { LibSQLDatabase } from 'drizzle-orm/libsql';
import { schema } from 'src/database/schema';
import { InjectRepository } from 'src/vendors/drizzle/decorators/inject-repository.decorator';
import { DrizzleRepository } from 'src/vendors/drizzle/drizzle.repository';

@Injectable()
export class UrlService {
  constructor(
    @InjectClient() private readonly drizzle: LibSQLDatabase<typeof schema>,
    @InjectRepository(urls)
    private readonly urlRepo: DrizzleRepository<typeof urls>,
  ) {}

  public async shorten(url: string) {
    return this.urlRepo.insert({
      target: url,
      slug: new Date().getTime().toString(),
    });
  }

  public async getAllUrls() {
    return this.urlRepo.select();
  }
}
