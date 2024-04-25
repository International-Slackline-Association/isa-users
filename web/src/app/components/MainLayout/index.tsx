import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Box } from '@mui/system';

import { selectUserInfo } from 'app/slices/user/selectors';
import { useMediaQuery } from 'utils/hooks/useMediaQuery';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const MainLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;

  const currentUserInfo = useSelector(selectUserInfo);

  const { isDesktop } = useMediaQuery();

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <Box
      sx={{
        paddingTop: isDesktop ? '0' : '64px',
        height: '100%',
      }}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} />
      {currentUserInfo?.email ? (
        <>
          <Sidebar
            onClose={handleSidebarClose}
            open={shouldOpenSidebar}
            variant={isDesktop ? 'persistent' : 'temporary'}
          />
          <Box
            component={'main'}
            sx={{
              height: '100vh',
              ml: isDesktop ? '240px' : '0',
            }}
          >
            {children}
          </Box>
        </>
      ) : (
        <Box
          component={'main'}
          sx={{
            height: isDesktop ? '100vh' : 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};
