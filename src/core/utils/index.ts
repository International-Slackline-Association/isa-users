import cloneDeep from 'lodash.clonedeep';

const hasValue = (v: any) => {
  return v !== null && v !== undefined;
};

export const assignExistingFields = <T, U>(obj1: T, obj2: U): T => {
  const v = cloneDeep(obj1);

  for (const [key, value] of Object.entries(obj2)) {
    if (hasValue(value) && key in v) {
      v[key] = value;
    }
  }
  return v;
};
