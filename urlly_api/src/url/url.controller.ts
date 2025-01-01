import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenDto } from './dto/shorten.dto';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get('/:slug')
  public getBySlug(@Param('slug') slug: string) {
    return this.urlService.getUrlBySlug(slug);
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
