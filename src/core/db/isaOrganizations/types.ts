import { DDBTableKeyAttrs } from 'core/db/types';

interface KeyAttrsParsed {
  email: string;
}

interface NonKeyAttrs {
  memberType?: 'active' | 'observer' | 'partner';
  organizationType?: 'club' | 'other';
}

export type DDBISAOrganizationItem = KeyAttrsParsed & NonKeyAttrs;
export type DDBISAOrganizationAttrs = DDBTableKeyAttrs & NonKeyAttrs;
