import {
  Body,
  Controller,
  Get,
  HttpRedirectResponse,
  Param,
  Post,
  Redirect,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenDto } from './dto/shorten.dto';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('/:slug')
  @Redirect('/', 301)
  public async getBySlug(@Param('slug') slug: string) {
    const { target } = await this.urlService.getUrlBySlug(slug);

    return {
      url: target,
    } as HttpRedirectResponse;
  }

  @Post('shorten')
  public shortenUrl(@Body() payload: ShortenDto) {
    return this.urlService.shorten(payload.url);
  }

  @Post('lengthen')
  public lengthenUrl() {
    return 'Get all urls';
  }
}
