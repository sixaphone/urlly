import { nanoid } from 'nanoid';

export class SlugService {
  static short() {
    return nanoid(14);
  }

  static long() {
    return nanoid(36);
  }
}
