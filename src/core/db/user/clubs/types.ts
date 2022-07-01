import { DDBTableKeyAttrs } from 'core/db/types';

interface KeyAttrsParsed {
  userId: string;
  clubId: string;
}

interface NonKeyAttrs {
  isPendingApproval?: boolean;
  joinedAt?: string;
}

export type DDBUserClubItem = KeyAttrsParsed & NonKeyAttrs;
export type DDBUserClubAttrs = DDBTableKeyAttrs & NonKeyAttrs;
