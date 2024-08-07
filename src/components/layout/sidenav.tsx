// src/components/layout/sidenav.tsx

'use client';

import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import NavLinks from '@/components/layout/nav-links';
import { useTheme, Box, Button } from '@mui/material';
import LogoutButton from '../ui/LogoutButton';

export default function SideNav({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (collapsed: boolean) => void }) {
  const theme = useTheme();

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
      <Box sx={{ display: 'flex', justifyContent: 'end', padding: '16px' }}>
        <Button onClick={toggleCollapse} sx={{ color: 'white', minWidth: 0, padding: 0 }}>
          <ChevronLeftIcon className={`w-6 transform ${collapsed ? 'rotate-180' : ''}`} />
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <NavLinks collapsed={collapsed} />
      </Box>
      <Box sx={{ mb: 1, ml: 1, mr: 1 }}>
        <LogoutButton theme={theme} collapsed={collapsed} />
      </Box>
    </Box>
  );
}
