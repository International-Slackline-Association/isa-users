import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import { Footer } from 'app/components/MainLayout/Footer';
import { selectCurrentUserInfo } from 'app/slices/app/selectors';

import { Profile } from './Profile';

interface Props {
  onClose: () => void;
  open: boolean;
  variant: 'persistent' | 'temporary';
}

export const Sidebar = (props: Props) => {
  const { open, variant, onClose } = props;
  const currentUserInfo = useSelector(selectCurrentUserInfo);
  const identityType = currentUserInfo?.identityType;

  const theme = useTheme();

  const pages = [
    {
      title: 'Profile',
      href: '/user/profile',
      disabled: false,
      show: identityType === 'individual',
      icon: <AccountCircleIcon />,
    },
    // {
    //   title: 'Organizations',
    //   href: '/user/organizations',
    //   show: identityType === 'individual',
    //   icon: <WorkspacesIcon />,
    // },
    {
      title: 'Certificates',
      href: '/user/certificates',
      show: identityType === 'individual',
      icon: <CardMembershipIcon />,
    },
    {
      title: 'Profile',
      href: '/organization/profile',
      disabled: false,
      show: identityType === 'organization',
      icon: <AccountCircleIcon />,
    },
    // {
    //   title: 'Members',
    //   href: '/organization/members',
    //   show: identityType === 'organization',
    //   icon: <WorkspacesIcon />,
    // },
    {
      title: 'Certificates',
      href: '/organization/certificates',
      show: identityType === 'organization',
      icon: <CardMembershipIcon />,
    },
  ];

  return (
    <Drawer
      sx={{
        width: '240px',
        height: '100%',
        [theme.breakpoints.down('lg')]: {
          height: 'calc(100% - 64px)',
        },
      }}
      anchor="left"
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 240,
          padding: 2,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          [theme.breakpoints.down('lg')]: {
            backgroundColor: 'inherit',
            color: theme.palette.text.primary,
            marginTop: '64px',
          },
          flex: 1,
        }}
      >
        <Stack spacing={2} alignItems={'strech'}>
          <Profile />
          <Divider sx={{ borderColor: theme.palette.primary.contrastText }} />
          <List>
            {pages.map(
              (page) =>
                page.show && (
                  <ListItem disableGutters key={page.title} sx={{ alignItems: 'flex-start' }}>
                    <IconButton
                      sx={{
                        borderRadius: 0,
                        justifyContent: 'flex-start',
                        width: '100%',
                      }}
                      color="inherit"
                      to={page.href}
                      component={NavLink}
                      size="small"
                    >
                      {page.icon}
                      <Typography sx={{ marginLeft: 1 }}>{page.title}</Typography>
                    </IconButton>
                  </ListItem>
                ),
            )}
          </List>
        </Stack>
        <Box sx={{ mt: 'auto' }}>
          <Footer />
        </Box>
      </Box>
    </Drawer>
  );
};
