'use client';

import { Box } from '@mui/material';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ThemeProvider, Theme } from '@mui/material/styles';
import { defaultTheme } from '@/components/layout/themes';
import SideNav from '@/components/layout/sidenav';
import TopNav from '@/components/layout/topnav';

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
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme}>
        <div className="flex h-screen overflow-hidden">
          <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />
          <div className="flex flex-col flex-grow">
            <TopNav collapsed={collapsed} />
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                backgroundColor: theme.palette.background.paper, // Use theme background color
                padding: { xs: 6 },
                transition: 'all 0.3s',
                marginLeft: collapsed ? '4rem' : '15rem',
                paddingTop: '1rem',
              }}
            >
              <Box sx={{ m: 5 }}></Box>
              {children}
            </Box>
          </div>
        </div>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
