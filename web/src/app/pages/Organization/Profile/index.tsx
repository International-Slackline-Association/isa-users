import { Stack } from '@mui/material';

import { MyProfile } from 'app/pages/Organization/Profile/MyProfile';
import { WarningInfo } from 'app/pages/Organization/Profile/WarningInfo';

export function OrganizationProfilePage() {
  return (
    <Stack spacing={2} margin={4}>
      <WarningInfo />
      <MyProfile />
    </Stack>
  );
}
