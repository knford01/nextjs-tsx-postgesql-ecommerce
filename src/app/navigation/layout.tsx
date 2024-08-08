// src/app/navigation/layout.tsx

'use client';

import { Box } from '@mui/material';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider, Theme } from '@mui/material/styles';
import { lightTheme, darkTheme, defaultTheme } from '@/components/layout/themes';
import SideNav from '@/components/layout/sidenav';
import TopNav from '@/components/layout/topnav';
import { useRouter } from 'next/navigation';
import { fetchUserTheme } from '@/db/user-data';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('/api/auth/session');

      if (!response.ok) {
        console.log('Bad Response');
        router.push('/logout'); // Redirect to the logout page if the session is not valid
      } else {
        const session = await response.json();
        const userTheme = await fetchUserTheme(session.user.id);

        const themeName = userTheme[0]?.theme || 'defaultTheme';
        setTheme(defaultTheme);

        switch (themeName) {
          case 'lightTheme':
            setTheme(lightTheme);
            break;
          case 'darkTheme':
            setTheme(darkTheme);
            break;
          default:
            setTheme(defaultTheme);
        }
      }
    };

    checkSession();
  }, [router]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme}>
        <div className="flex h-screen overflow-hidden">
          <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              transition: 'margin-left 0.3s',
              marginLeft: collapsed ? '64px' : '240px', // Adjust based on collapsed state
            }}
          >
            <TopNav collapsed={collapsed} />
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                backgroundColor: theme.palette.background.paper,
                padding: { xs: 4 },
                transition: 'all 0.3s',
                paddingTop: '1rem',
              }}
            >
              {children}
            </Box>
          </Box>
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
