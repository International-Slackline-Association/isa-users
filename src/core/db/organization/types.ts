import { DDBTableKeyAttrs } from 'core/db/types';

interface KeyAttrsParsed {
  organizationId: string;
  email: string;
}

interface NonKeyAttrs {
  cognitoSub: string;
  cognitoUsername: string;
  name?: string;
  profilePictureUrl?: string;
  city?: string;
  country?: string;
  organizationType?: 'club' | 'other';
  memberType?: string;
  contactPhone?: string;
}

export type DDBOrganizationItem = KeyAttrsParsed & NonKeyAttrs;
export type DDBOrganizationAttrs = DDBTableKeyAttrs & NonKeyAttrs;
