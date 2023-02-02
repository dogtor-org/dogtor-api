import { createHash } from 'crypto';

export function sha1(str: string) {
  return createHash('sha1').update(str).digest('hex');
}