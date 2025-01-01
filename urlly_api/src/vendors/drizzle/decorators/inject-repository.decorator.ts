import { Inject } from '@nestjs/common';
import { Table } from 'drizzle-orm';
import { getEntityToken } from '../utils/get-entity-token';

export const InjectRepository = (entity: Table): ReturnType<typeof Inject> =>
  Inject(getEntityToken(entity));
