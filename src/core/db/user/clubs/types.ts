import { DDBTableKeyAttrs } from 'core/db/types';

interface KeyAttrsParsed {
  clubId: string;
}

interface NonKeyAttrs {}

export type DDBUserClubItem = KeyAttrsParsed & NonKeyAttrs;
export type DDBUserClubAttrs = DDBTableKeyAttrs & NonKeyAttrs;
