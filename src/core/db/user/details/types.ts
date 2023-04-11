import { DDBTableKeyAttrs } from 'core/db/types';

interface ParsedKeyAttrs {
  userId: string;
  email: string;
}
interface NonKeyAttrs {
  cognitoSub: string;
  cognitoUsername: string;
  name?: string;
  surname?: string;
  gender?: 'm' | 'f' | 'o';
  birthDate?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  emergencyContact?: string;
  profilePictureUrl?: string;
  createdDateTime?: string;

}

export type DDBUserDetailItem = ParsedKeyAttrs & NonKeyAttrs;
export type DDBUserDetailAttrs = DDBTableKeyAttrs & NonKeyAttrs;
