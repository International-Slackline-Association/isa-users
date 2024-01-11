import { Stack } from '@mui/system';

import { AllOrganizations } from 'app/pages/User/UserOrganizations/AllOrganizations';
import { MyOrganizations } from 'app/pages/User/UserOrganizations/MyOrganizations';

export function UserOrganizationsPage() {
  return (
    <Stack spacing={2} margin={4}>
      <MyOrganizations />
      <AllOrganizations />
    </Stack>
  );
}
