import nanoid from 'nanoid';

export class SlugService {
  private static nanoid = nanoid.customAlphabet(
    '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    21,
  );

  static short() {
    return SlugService.nanoid(14);
  }

  static long() {
    return SlugService.nanoid(36);
  }
}
