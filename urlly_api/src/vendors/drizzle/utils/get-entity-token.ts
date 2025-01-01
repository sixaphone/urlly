import { Table } from 'drizzle-orm';

export const getEntityToken = (entity: Table) => {
  return `drizzle_entity:${entity[Symbol.for('drizzle:Name')]}`;
};
