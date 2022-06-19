import cloneDeep from 'lodash.clonedeep';
import { DDBTableKeyAttrs, TransformerParams } from 'core/db/types';

export const TABLE_NAME = process.env.ISA_USERS_TABLE;
export const INDEX_NAMES = {
  GSI: 'GSI-GSI_SK',
  LSI: 'PK-LSI',
};

export const transformUtils = <DDBItem, DDBAttrs extends DDBTableKeyAttrs>(
  keyUtils: TransformerParams<Omit<DDBItem, keyof DDBAttrs>>,
) => {
  const keyFields: { [P in keyof DDBTableKeyAttrs]: P } = {
    PK: 'PK',
    SK_GSI: 'SK_GSI',
    GSI_SK: 'GSI_SK',
    LSI: 'LSI',
  };

  const key = (params: Partial<Omit<DDBItem, keyof DDBAttrs>>) => {
    return { PK: keyUtils.PK.compose(params || {}), SK_GSI: keyUtils.SK_GSI.compose(params || {}) };
  };

  const attrsToItem = (attrs: DDBAttrs): DDBItem => {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = attrs;
    let item = { ...rest };
    for (const [key, value] of Object.entries(keyUtils)) {
      item = { ...item, ...value.destruct(attrs[key]) };
    }
    return item as unknown as DDBItem;
  };

  const itemToAttrs = (item: DDBItem): DDBAttrs => {
    const attrs = cloneDeep(item);

    for (const [key, value] of Object.entries(keyUtils)) {
      const composeParams = {} as any;
      for (const field of value.fields || []) {
        const fieldValue = item[field];
        if (fieldValue) {
          composeParams[field] = item[field];
          delete attrs[field];
        }
      }
      attrs[key] = value.compose(composeParams || {});
    }
    return attrs as unknown as DDBAttrs;
  };

  return { key, attrsToItem, itemToAttrs, keyFields, keyUtils };
};

const delimeter = '::';
export const composeKey = (base: string, ...params: string[]) => {
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
