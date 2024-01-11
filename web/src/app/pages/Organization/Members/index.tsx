import { Stack } from '@mui/system';

import { Members } from 'app/pages/Organization/Members/MyMembers';

export function OrganizationMembersPage() {
  return (
    <Stack spacing={2} margin={4}>
      <Members />
    </Stack>
  );
}
