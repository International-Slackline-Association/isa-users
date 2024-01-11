import { useDispatch } from 'react-redux';

import EmailIcon from '@mui/icons-material/Email';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import InputIcon from '@mui/icons-material/Input';
import { Grid, IconButton, Link, Typography } from '@mui/material';

import { appActions, useAppSlice } from 'app/slices/app';
import { AuthState } from 'app/slices/app/types';

export const Footer = () => {
  useAppSlice();

  const dispatch = useDispatch();

  return (
    <Grid container spacing={1} sx={{}}>
      <Grid item xs={12}>
        <Link
          sx={{
            display: { xs: 'none', lg: 'flex' },
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
          href="https://www.slacklineinternational.org"
          target="_blank"
        >
          <img alt="ISA Logo" src="/images/logo-contrast.svg" width="100%" />
        </Link>
      </Grid>
      <Grid item xs={6}>
        <IconButton
          sx={{ borderRadius: 0, padding: 0 }}
          color="inherit"
          onClick={() => dispatch(appActions.updateAuthState(AuthState.SigningOut))}
        >
          <InputIcon sx={{ fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
            Logout
          </Typography>
        </IconButton>
      </Grid>
      <Grid item xs={6}>
        <IconButton
          sx={{ borderRadius: 0, padding: 0 }}
          size="small"
          color="inherit"
          href={`mailto:${'account@slacklineinternational.org'}?subject=${
            encodeURIComponent('ISA Account Contact') || ''
          }&body=${encodeURIComponent('') || ''}`}
        >
          <EmailIcon sx={{ fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
            Contact
          </Typography>
        </IconButton>
      </Grid>
      <Grid item xs={6}>
        <IconButton sx={{ borderRadius: 0, padding: 0 }} color="inherit">
          <HelpCenterIcon sx={{ fontSize: '1rem' }} />
          <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
            FAQ
          </Typography>
        </IconButton>
      </Grid>
      <Grid item xs={12}>
        <Typography fontSize={'0.5rem'}>
          Copyright © 2022 International Slackline Association. All rights reserved.
        </Typography>
      </Grid>
    </Grid>
  );
};
