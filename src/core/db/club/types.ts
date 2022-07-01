import { DDBTableKeyAttrs } from 'core/db/types';

interface KeyAttrsParsed {
  clubId: string;
}

interface NonKeyAttrs {
  cognitoSub: string;
  email: string;
  name: string;
  profilePictureUrl?: string;
  city?: string;
  country?: string;
  memberType?: 'active' | 'observer' | 'partner';
  contactPhone?: string;
}

export type DDBClubItem = KeyAttrsParsed & NonKeyAttrs;
export type DDBClubAttrs = DDBTableKeyAttrs & NonKeyAttrs;
