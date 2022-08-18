import { DDBTableKeyAttrs } from 'core/db/types';

interface KeyAttrsParsed {
  userId: string;
  organizationId: string;
}

interface NonKeyAttrs {
  isPendingApproval?: boolean;
  joinedAt?: string;
}

export type DDBUserOrganizationItem = KeyAttrsParsed & NonKeyAttrs;
export type DDBUserOrganizationAttrs = DDBTableKeyAttrs & NonKeyAttrs;
