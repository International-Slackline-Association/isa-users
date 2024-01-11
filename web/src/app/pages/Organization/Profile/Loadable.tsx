/**
 * Asynchronously loads the component for HomePage
 */
import { lazyLoad } from 'utils/loadable';

export const OrganizationProfilePage = lazyLoad(
  () => import('./index'),
  (module) => module.OrganizationProfilePage,
);
