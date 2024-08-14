'use client';

import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import NavLinks from '@/components/layout/nav-links';
import { useTheme, Box, Button, Typography } from '@mui/material';
import LogoutButton from '../ui/LogoutButton';
import { COMPANY_NAME } from '@/constants/appConstants';
import { User } from '@/types/user';

export default function SideNav({ collapsed, setCollapsed, sessionUser }: { collapsed: boolean, setCollapsed: (collapsed: boolean) => void, sessionUser: User | null }) {
  const theme = useTheme();

  if (!sessionUser) {
    return null; // or return a loading state or something else appropriate
  }

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.text.primary,
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        width: collapsed ? '64px' : '240px',
        transition: 'all 0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px'
        }}
      >
        {!collapsed && (
          <Typography sx={{ color: 'white', fontWeight: 'bold', pl: 2 }}>
            {COMPANY_NAME}
          </Typography>
        )}
        <Button onClick={toggleCollapse} sx={{ color: 'white', minWidth: 0, padding: 0 }}>
          <ChevronLeftIcon className={`w-6 transform ${collapsed ? 'rotate-180' : ''}`} />
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <NavLinks collapsed={collapsed} sessionUser={sessionUser} />
      </Box>

      <Box sx={{ mb: 1, ml: 1, mr: 1 }}>
        <LogoutButton theme={theme} collapsed={collapsed} />
      </Box>
    </Box>
  );
}
