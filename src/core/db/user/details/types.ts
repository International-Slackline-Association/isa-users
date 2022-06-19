import { DDBTableKeyAttrs } from 'core/db/types';

interface ParsedKeyAttrs {
  userId: string;
}
interface NonKeyAttrs {
  cognitoSub: string;
  email: string;
  name: string;
  surname: string;
  identityType: 'individual' | 'club';
  gender?: 'm' | 'f';
  birthDate?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  emergencyContact?: string;
}

export type DDBUserDetailItem = ParsedKeyAttrs & NonKeyAttrs;
export type DDBUserDetailAttrs = DDBTableKeyAttrs & NonKeyAttrs;
