/**
 * Asynchronously loads the component for HomePage
 */
import { lazyLoad } from 'utils/loadable';

export const OrganizationMembersPage = lazyLoad(
  () => import('./index'),
  (module) => module.OrganizationMembersPage,
);
