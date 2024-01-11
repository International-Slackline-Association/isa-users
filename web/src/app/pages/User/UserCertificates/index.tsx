import { Stack } from '@mui/material';

import { MyCertificates } from 'app/components/MyCertificates';

export function UserCertificates() {
  return (
    <Stack spacing={2} margin={4}>
      <MyCertificates />
    </Stack>
  );
}
