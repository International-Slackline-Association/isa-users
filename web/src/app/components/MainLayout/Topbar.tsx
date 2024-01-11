import { useSelector } from 'react-redux';

import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Link, Toolbar } from '@mui/material';
import { Box } from '@mui/system';

import { useAppSlice } from 'app/slices/app';
import { selectAuthState } from 'app/slices/app/selectors';
import { AuthState } from 'app/slices/app/types';

interface Props {
  onSidebarOpen: () => void;
}

export const Topbar = (props: Props) => {
  useAppSlice();

  const { onSidebarOpen } = props;

  const authState = useSelector(selectAuthState);

  return (
    <AppBar sx={{ flexGrow: 1, display: { lg: 'none' } }}>
      <Toolbar sx={{ height: '64px' }}>
        <Box
          sx={{
            padding: 0,
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          <Link href="https://www.slacklineinternational.org" target="_blank">
            <img alt="ISA Logo" src="/images/logo-contrast.svg" height="32px" />
          </Link>

          {/* <Typography variant="subtitle1" sx={{ m: 2 }}>
             Users
          </Typography> */}
        </Box>
        {authState === AuthState.SignedIn && (
          <IconButton color="inherit" onClick={onSidebarOpen}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};
