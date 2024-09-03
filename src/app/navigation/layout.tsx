//src/app/navigation/layout.tsx
'use client';

import { Box } from '@mui/material';
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { ThemeProvider, Theme } from '@mui/material/styles';
import { themes } from '@/components/layout/themes';
import SideNav from '@/components/layout/sidenav';
import TopNav from '@/components/layout/topnav';
import { useRouter } from 'next/navigation';
import { fetchUserTheme } from '@/db/user-data';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { ToastContainer } from 'react-toastify';
import { User } from '@/types/user';
import { getCombinedPermissions } from '@/utils/permissions2';
import { CombinedPermissionsProvider } from '@/components/layout/combinedpermissions';
import { CheckSessionProvider } from '@/components/layout/checksession';

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
  const [theme, setTheme] = useState<Theme>(themes.defaultTheme);
  const [collapsed, setCollapsed] = useState(false);
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [combinedPermissions, setCombinedPermissions] = useState<CombinedPermission[]>([]);

  const checkSession = useCallback(async () => {
    const response = await fetch('/api/auth/session');

    if (!response.ok) {
      // console.log('Bad Session Response');
      router.push('/logout'); // Redirect to the logout page if the session is not valid
    } else {
      const session = await response.json();
      const userTheme = await fetchUserTheme(session.user.id);
      setSessionUser(session.user);

      // Fetch combined permissions and set them in state
      const permissions = await getCombinedPermissions(session.user.id, session.user.role);
      setCombinedPermissions(permissions);

      const themeName = userTheme[0]?.theme || 'defaultTheme';

      switch (themeName) {
        case 'lightTheme':
          setTheme(themes.lightTheme);
          break;
        case 'darkTheme':
          setTheme(themes.darkTheme);
          break;
        default:
          setTheme(themes.defaultTheme);
      }
    }
  }, [router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Ensure that theme is defined before rendering the layout
  if (!theme) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme}>
        <CombinedPermissionsProvider combinedPermissions={combinedPermissions}>
          <CheckSessionProvider checkSession={checkSession}>
            <div className="flex h-screen overflow-hidden">
              <SideNav collapsed={collapsed} setCollapsed={setCollapsed} sessionUser={sessionUser} />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflowX: 'auto',
                  flexGrow: 1,
                  transition: 'margin-left 0.3s',
                  marginLeft: collapsed ? '64px' : '240px',  // Adjust based on collapsed state
                }}
              >
                <TopNav
                  collapsed={collapsed}
                  sessionUser={sessionUser}
                  checkSession={checkSession}  // Pass checkSession to TopNav
                />
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    overflowX: 'auto',  // Allows horizontal scrolling
                    backgroundColor: theme?.palette?.background?.paper || themes.defaultTheme.palette.background.paper,
                    padding: { xs: 4 },
                    transition: 'all 0.3s',
                    paddingTop: '1rem',
                    className: "child-element"
                  }}
                >
                  <Box sx={{ p: 0, pt: 5, display: 'flex', justifyContent: 'space-between' }}>
                    {/* <Breadcrumbs /> */}
                    <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="colored"
                    />
                  </Box>
                  {children}
                </Box>
              </Box>
            </div>
          </CheckSessionProvider>
        </CombinedPermissionsProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
