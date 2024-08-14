'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Menu, MenuItem, Avatar, Typography, useTheme, Button } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import StopIcon from '@mui/icons-material/Stop';
import useSession from '@/hooks/useSession';
import { useThemeContext } from '@/app/navigation/layout';
import { lightTheme, darkTheme, defaultTheme } from './themes';
import { setUserTheme } from '@/db/user-data';
import { UserModal } from '../modals/UserModals';

interface TopNavProps {
    collapsed: boolean;
    sessionUser: any;
    setSessionUser: any;
}

const TopNav: React.FC<TopNavProps> = ({ collapsed, sessionUser, setSessionUser }) => {
    const theme = useTheme();
    const { setTheme } = useThemeContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [session, setSession] = useState<any>(sessionUser); // State to hold session data

    const fetchSession = useCallback(async () => {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
            const sessionData = await response.json();
            setSession(sessionData);
            setSessionUser(sessionData.user);
        }
    }, [setSessionUser]); // Empty dependency array ensures this function is stable

    useEffect(() => {
        fetchSession();
        const interval = setInterval(fetchSession, 15000); // Refresh session every 15 seconds
        return () => clearInterval(interval);
    }, [fetchSession]);

    const userId = session?.user?.id;
    const userName = session?.user?.first_name || 'User';
    const greeting = session?.user?.emulating_user_id ? 'Emulating' : 'Hello';

    const handleThemeClick = (event: React.MouseEvent<HTMLLIElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const updateThemeInDatabase = async (theme: 'lightTheme' | 'darkTheme' | 'defaultTheme') => {
        try {
            if (!userId) {
                throw new Error('User ID is undefined');
            }
            await setUserTheme(userId, theme);
        } catch (error) {
            console.error('Error updating theme in database:', error);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleUserModalOpen = () => {
        setIsUserModalOpen(true);
        handleMenuClose();
    };

    const handleUserModalClose = () => {
        setIsUserModalOpen(false);
    };

    const handleStopEmulation = async () => {
        if (session?.user?.emulating_user_id) {
            await fetch('/api/auth/emulate', {
                method: 'POST',
                body: JSON.stringify({ emulate: false, emulating_user: session.user }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            fetchSession(); // Refresh the session data after stopping emulation 
        }
        handleMenuClose();
    };

    const handleSubmit = (data: any) => {
        handleUserModalClose();
    };

    return (
        <Box
            sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                height: '56px',
                transition: 'all 0.3s',
                zIndex: 10,
                marginLeft: collapsed ? '64px' : '240px',
            }}
        >
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pl: 2 }}></Box>

            {/* Greeting and Avatar/Icon */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mr: 2,
                    padding: '8px 12px',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                }}
                onClick={(event: React.MouseEvent<HTMLDivElement>) => handleMenuClick(event as unknown as React.MouseEvent<HTMLButtonElement>)}
            >
                <Typography variant="body1" sx={{ mr: 1 }}>
                    {greeting} {userName}
                </Typography>
                <IconButton
                    sx={{
                        padding: 0, // remove extra padding from icon button
                    }}
                    color="inherit"
                >
                    {session?.user?.avatar ? (
                        <Avatar
                            src={session.user.avatar}
                            alt={`${userName}'s avatar`}
                            sx={{ width: 35, height: 35 }}
                        />
                    ) : (
                        <AccountCircleIcon sx={{ width: 35, height: 35 }} />
                    )}
                </IconButton>
            </Box>

            {/* User Menu Dropdown */}
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.primary,
                    },
                }}
            >
                {session?.user?.emulating_user_id && (
                    <MenuItem onClick={handleStopEmulation}>
                        <StopIcon sx={{ mr: 1 }} />
                        Stop Emulating
                    </MenuItem>
                )}
                <MenuItem onClick={handleUserModalOpen}>
                    <EditIcon sx={{ mr: 1 }} />
                    Edit Profile
                </MenuItem>
                <MenuItem onClick={(event) => {
                    handleThemeClick(event as unknown as React.MouseEvent<HTMLLIElement, MouseEvent>);
                }}>
                    <PaletteIcon sx={{ mr: 1 }} />
                    Change Theme
                </MenuItem>
            </Menu>

            {/* Theme Palette Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.text.primary,
                    },
                }}
            >
                <MenuItem onClick={() => { setTheme(lightTheme); updateThemeInDatabase('lightTheme'); handleClose(); }}>Light Theme</MenuItem>
                <MenuItem onClick={() => { setTheme(darkTheme); updateThemeInDatabase('darkTheme'); handleClose(); }}>Dark Theme</MenuItem>
                <MenuItem onClick={() => { setTheme(defaultTheme); updateThemeInDatabase('defaultTheme'); handleClose(); }}>Default Theme</MenuItem>
            </Menu>

            {/* UserModal Component */}
            {userId && (
                <UserModal
                    open={isUserModalOpen}
                    onClose={handleUserModalClose}
                    onSubmit={handleSubmit}
                    id={userId}
                    row={session.user}
                />
            )}
        </Box>
    );
};

export default TopNav;
