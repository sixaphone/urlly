import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class UrlController {
  @Get()
  public getAllUrls() {
    return 'Get all urls';
  }

  @Post('shorten')
  public shortenUrl() {
    return 'Get all urls';
  }

  @Post('lengthen')
  public lengthenUrl() {
    return 'Get all urls';
  }
}
