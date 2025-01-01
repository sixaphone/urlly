import { Inject } from '@nestjs/common';
import { getClientToken } from '../utils/get-client-token';

export const InjectClient = (name?: string): ReturnType<typeof Inject> =>
  Inject(getClientToken(name));
