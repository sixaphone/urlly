import { Body, Controller, Get, Post } from '@nestjs/common';
import { UrlService } from './url.service';
import { ShortenDto } from './dto/shorten.dto';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Get()
  public getAllUrls() {
    return this.urlService.getAllUrls();
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
