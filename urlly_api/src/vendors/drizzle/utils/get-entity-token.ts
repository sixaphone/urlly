import { Table } from 'drizzle-orm';

export const getEntityName = (entity: Table): string => {
  return entity[Symbol.for('drizzle:Name')];
};

export const getEntityToken = (entity: Table) => {
  return `drizzle_entity:${getEntityName(entity)}`;
};
