/**
 * Asynchronously loads the component for HomePage
 */
import { lazyLoad } from 'utils/loadable';

export const OrganizationCertificates = lazyLoad(
  () => import('./index'),
  (module) => module.OrganizationCertificates,
);
