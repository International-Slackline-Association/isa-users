import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import Lock from '@mui/icons-material/Lock';
import LockOpen from '@mui/icons-material/LockOpen';
import { Box, Button, Stack, Typography } from '@mui/material';

import { CustomPopup } from 'app/pages/SignIn/CustomPopup';
import { PrivacyPolicy } from 'app/pages/SignIn/PrivacyPolicy';
import { TermsAndConditions } from 'app/pages/SignIn/TermsAndConditions';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';

import { CannotAccessInfo } from './CannotAccessInfo';

interface Props {
  signInClicked: () => void;
}

export const SignIn = (props: Props) => {
  const [signInHover, setSignInHover] = useState<boolean>(false);
  const { isDesktop } = useMediaQuery();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        height: '100%',
        width: '100%',
      }}
    >
      <Stack direction="column" alignItems="center" spacing={6} width={isDesktop ? '33vw' : '80vw'}>
        <Box component={'img'} alt="ISA Logo" src="/images/logo-wide.svg" width={'100%'}></Box>
        <Stack
          spacing={2}
          sx={{
            mt: 4,
            '& b': {
              color: (theme) => theme.palette.primary.main,
            },
          }}
        >
          <Box display="flex" alignItems="center">
            <CheckIcon color="primary" sx={{ fontSize: '1.8rem' }} />
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              <b>Create</b> & <b>Manage</b> your ISA profile with your basic information.
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <CheckIcon color="primary" sx={{ fontSize: '1.8rem' }} />
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              Download your <b>verified certificates</b> and prove your <b>membership</b> to your
              clubs, associations etc.
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <CheckIcon color="primary" sx={{ fontSize: '1.8rem' }} />
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              Keep your information <b>private</b> without sharing with any third-parties.
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent={'space-between'}
            sx={{ pl: 8, pr: 8 }}
          >
            <CustomPopup title="Privacy Policy">
              <PrivacyPolicy />
            </CustomPopup>
            <CustomPopup title="Terms and Conditions">
              <TermsAndConditions />
            </CustomPopup>
          </Box>
        </Stack>
        <Stack spacing={1} sx={{}}>
          <Button
            onClick={props.signInClicked}
            color="primary"
            variant="contained"
            size="large"
            startIcon={signInHover ? <LockOpen /> : <Lock />}
            onMouseEnter={() => setSignInHover(true)}
            onMouseLeave={() => setSignInHover(false)}
          >
            Sign In / Sign Up
          </Button>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center' }}>
            or
          </Typography>
          <CustomPopup title="Cannot access your account?">
            <CannotAccessInfo />
          </CustomPopup>
        </Stack>
      </Stack>
    </Box>
  );
};
