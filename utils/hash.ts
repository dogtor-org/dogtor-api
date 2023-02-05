import { createHash } from 'crypto';

/**
 * Hash cpf
 */
export function sha1(str: string) {
  return createHash('sha1').update(str).digest('hex');
}