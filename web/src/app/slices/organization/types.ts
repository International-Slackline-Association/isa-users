import { GetOrganizationAPIResponse } from 'app/api/organization-api';

/* --- STATE --- */
export interface OrganizationState {
  organizationInfo?: GetOrganizationAPIResponse;
}
