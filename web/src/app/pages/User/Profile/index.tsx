import { Stack } from '@mui/material';

import { MyProfile } from 'app/pages/User/Profile/MyProfile';
import { WarningInfo } from 'app/pages/User/Profile/WarningInfo';

export function UserProfilePage() {
  return (
    <Stack spacing={2} margin={4}>
      <WarningInfo />
      <MyProfile />
    </Stack>
  );
}
