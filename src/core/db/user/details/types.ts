import { DDBTableKeyAttrs } from 'core/db/types';

interface ParsedKeyAttrs {
  userId: string;
}
interface NonKeyAttrs {
  cognitoSub: string;
  email: string;
  name: string;
  surname: string;
  gender?: 'm' | 'f' | 'o';
  birthDate?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  emergencyContact?: string;
  profilePictureUrl?: string;
}

export type DDBUserDetailItem = ParsedKeyAttrs & NonKeyAttrs;
export type DDBUserDetailAttrs = DDBTableKeyAttrs & NonKeyAttrs;
