import cloneDeep from 'lodash.clonedeep';
import { DDBTableKeyAttrs } from 'core/db/types';

type TransformerParams<T> = {
  [key in keyof DDBTableKeyAttrs]?: {
    fields?: (keyof T)[];
    compose: (params: { [key in keyof T]?: T[key] }) => string;
    destruct?: (key: string) => { [key in keyof T]?: T[key] };
  };
};

export const transformUtils = <DDBItem, DDBAttrs extends DDBTableKeyAttrs>(
  t: TransformerParams<Omit<DDBItem, keyof DDBAttrs>>,
) => {
  const key = (params: Omit<DDBItem, keyof DDBAttrs>) => {
    return { PK: t.PK.compose(params), SK_GSI: t.SK_GSI.compose(params) };
  };

  const attrsToItem = (attrs: DDBAttrs): DDBItem => {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = attrs;
    let item = { ...rest };
    for (const [key, value] of Object.entries(t)) {
      item = { ...item, ...value.destruct(attrs[key]) };
    }
    return item as unknown as DDBItem;
  };

  const itemToAttrs = (item: DDBItem): DDBAttrs => {
    const attrs = cloneDeep(item);

    for (const [key, value] of Object.entries(t)) {
      const composeParams = {} as any;
      for (const field of value.fields || []) {
        const fieldValue = item[field];
        if (fieldValue) {
          composeParams[field] = item[field];
          delete attrs[field];
        }
      }
      attrs[key] = value.compose(composeParams);
    }
    return attrs as unknown as DDBAttrs;
  };

  return { key, attrsToItem, itemToAttrs };
};

const delimeter = '::';
export const compositeKey = (base: string, ...params: string[]) => {
  let str = base;
  for (const param of params) {
    if (param !== undefined && param !== null && param.length > 0) {
      str = str + delimeter + param;
    } else {
      break;
    }
  }
  return str;
};

export const destructKey = (key: string, index: number): string => {
  if (!key) {
    return null;
  }
  const token = key.split(delimeter)[index];
  return token;
};
