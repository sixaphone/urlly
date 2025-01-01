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
import { CreateUrlDto } from './dto/shorten.dto';

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
  public async shortenUrl(@Body() payload: CreateUrlDto) {
    const url = await this.urlService.shorten(payload.url);

    return {
      url,
    };
  }

  @Post('lengthen')
  public async lengthenUrl(@Body() payload: CreateUrlDto) {
    const url = await this.urlService.lengthen(payload.url);

    return {
      url,
    };
  }
}
