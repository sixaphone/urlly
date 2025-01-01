import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';

describe(UrlController.name, () => {
  // let urlController: UrlController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [],
    }).compile();

    urlController = app.get<UrlController>(UrlController);
  });

  it('should return "Hello World!"', () => {
    // expect(appController.getHello()).toBe('Hello World!');
  });
});
