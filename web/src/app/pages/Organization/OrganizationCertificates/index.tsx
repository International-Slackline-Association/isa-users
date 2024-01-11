import { Stack } from '@mui/material';

import { MyCertificates } from 'app/components/MyCertificates';

export function OrganizationCertificates() {
  return (
    <Stack spacing={2} margin={4}>
      <MyCertificates />
    </Stack>
  );
}
