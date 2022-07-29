import cloneDeep from 'lodash.clonedeep';
import { DDBTableKeyAttrs, TransformerParams } from 'core/db/types';

export const TABLE_NAME = process.env.ISA_USERS_TABLE;
export const INDEX_NAMES = {
  LSI: 'LSI',
  LSI2: 'LSI2',
  GSI: 'GSI',
  GSI2: 'GSI2',
};

export const transformUtils = <DDBItem, DDBAttrs extends DDBTableKeyAttrs>(
  keyUtils: TransformerParams<Omit<DDBItem, keyof DDBAttrs>>,
) => {
  const keyFields: { [P in keyof DDBTableKeyAttrs]: P } = {
    PK: 'PK',
    SK_GSI: 'SK_GSI',
    LSI: 'LSI',
    LSI2: 'LSI2',
    GSI_SK: 'GSI_SK',
    GSI2: 'GSI2',
    GSI2_SK: 'GSI2_SK',
  };

  const key = (params: Partial<Omit<DDBItem, keyof DDBAttrs>>) => {
    return { PK: keyUtils.PK.compose(params || {}), SK_GSI: keyUtils.SK_GSI.compose(params || {}) };
  };

  const attrsToItem = (attrs: DDBAttrs): DDBItem => {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = attrs;
    let item = { ...rest };
    for (const [key, value] of Object.entries(keyUtils)) {
      if (value.destruct) {
        item = { ...item, ...value.destruct(attrs[key]) };
      }
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

const delimeter = ':';
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
