import { DDBTableKeyAttrs } from 'core/db/types';

interface ParsedKeyAttrs {
  hash: string;
}
interface NonKeyAttrs {
  ddb_ttl?: number;
  value: string;
}

export type DDBGenericHashItem = ParsedKeyAttrs & NonKeyAttrs;
export type DDBGenericHasAttrs = DDBTableKeyAttrs & NonKeyAttrs;
