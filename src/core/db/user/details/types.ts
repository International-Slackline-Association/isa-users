import { DDBTableKeyAttrs } from 'core/db/types';

interface ParsedKeyAttrs {
  email: string;
}

interface NonKeyAttrs {
  cognitoUsername: string;
  name: string;
  surname: string;
  gender?: 'm' | 'f';
  identityType?: 'person' | 'club';
  city?: string;
  country?: string;
}

export type DDBUserDetailItem = ParsedKeyAttrs & NonKeyAttrs;
export type DDBUserDetailAttrs = DDBTableKeyAttrs & NonKeyAttrs;
