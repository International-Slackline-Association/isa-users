import { Stack } from '@mui/material';

import { MyProfile } from 'app/pages/User/Profile/MyProfile';

export function UserProfilePage() {
  return (
    <Stack spacing={2} margin={4}>
      <MyProfile />
    </Stack>
  );
}
