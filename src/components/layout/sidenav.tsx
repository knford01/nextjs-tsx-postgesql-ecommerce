// src/components/layout/layout.tsx

'use client';

import { ChevronLeftIcon, PowerIcon } from '@heroicons/react/24/outline';
import NavLinks from '@/components/layout/nav-links';
import { useTheme, Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function SideNav({ collapsed, setCollapsed }: { collapsed: boolean, setCollapsed: (collapsed: boolean) => void }) {
  const theme = useTheme();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'GET',
    });

    if (response.ok) {
      router.push('/login'); // Redirect to login page after successful logout
    }
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
        <form onClick={handleLogout}>
          <Box
            component="button"
            type="submit"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              height: 48,
              textDecoration: 'none',
              fontWeight: 'medium',
              borderColor: 'black',
              backgroundColor: `${theme.palette.warning.main} !important`,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: `${theme.palette.warning.dark} !important`,
                color: theme.palette.text.secondary,
              },
              width: '100%',
              transition: 'background-color 0.3s, color 0.3s',
              borderRadius: 2,
              marginRight: 1,
              marginBottom: 1,
            }}
          >
            <PowerIcon className="w-6 ml-3" />
            {!collapsed && <div>Sign Out</div>}
          </Box>
        </form>
      </Box>
    </Box>
  );
}
