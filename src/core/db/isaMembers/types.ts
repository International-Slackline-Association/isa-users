import { DDBTableKeyAttrs } from 'core/db/types';

interface KeyAttrsParsed {
  email: string;
}

interface NonKeyAttrs {
  memberType?: 'active' | 'observer' | 'partner';
}

export type DDBISAMemberItem = KeyAttrsParsed & NonKeyAttrs;
export type DDBISAMemberAttrs = DDBTableKeyAttrs & NonKeyAttrs;
