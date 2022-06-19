import { DDBTableKeyAttrs } from 'core/db/types';

interface KeyAttrsParsed {
  userId: string;
  clubId: string;
}

interface NonKeyAttrs {
  isPendingApproval?: string;
}

export type DDBUserClubItem = KeyAttrsParsed & NonKeyAttrs;
export type DDBUserClubAttrs = DDBTableKeyAttrs & NonKeyAttrs;
