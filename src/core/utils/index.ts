import cloneDeep from 'lodash.clonedeep';
import * as crypto from 'crypto';

const hasValue = (v: any) => {
  return v !== null && v !== undefined;
};

export const assignExistingFields = <T, U>(obj1: T, obj2: U): T => {
  const v = cloneDeep(obj1);
  for (const [key, value] of Object.entries(obj2)) {
    if (hasValue(value)) {
      v[key] = value;
    }
  }
  return v;
};

export const generateIdFromEmail = (email: string) => {
  const hash = crypto.createHash('sha256').update(email).digest('hex');
  return `ISA_${hash.substring(0, 8)}`.toUpperCase();
};
