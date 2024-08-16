'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, IconButton, Menu, MenuItem, Avatar, Typography, useTheme, Button } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import StopIcon from '@mui/icons-material/Stop';
import { useThemeContext } from '@/app/navigation/layout';
import { themes } from './themes';
import { setUserTheme } from '@/db/user-data';
import { UserModal } from '../modals/UserModals';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { fetchNotifications } from '@/db/notification-data';

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
    const [session, setSession] = useState<any>(sessionUser);
    const [notifications, setNotifications] = useState<Notice[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const fetchSession = useCallback(async () => {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
            const sessionData = await response.json();
            setSession(sessionData);
            setSessionUser(sessionData.user);
        }
    }, [setSessionUser]);

    useEffect(() => {
        fetchSession();
        const interval = setInterval(fetchSession, 15000);
        return () => clearInterval(interval);
    }, [fetchSession]);

    useEffect(() => {
        const fetchUserNotifications = async () => {
            const data = await fetchNotifications();
            setNotifications(data);
            const unread = data.filter(n => !n.date_viewed).length;
            setUnreadCount(unread);
        };

        fetchUserNotifications();
    }, []);

    const handleNotificationsClick = () => {
        setIsNotificationsOpen(true);
    };

    const handleNotificationsClose = () => {
        setIsNotificationsOpen(false);
    };

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
            fetchSession();
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
                justifyContent: 'space-between', // This will space items evenly with the bell and avatar on the right
                height: '56px',
                transition: 'all 0.3s',
                zIndex: 10,
                marginLeft: collapsed ? '64px' : '240px',
                paddingRight: '16px', // Add some padding on the right side
            }}
        >
            <Box sx={{ flexGrow: 1 }}></Box> {/* This empty box will push the content to the right */}

            {/* Notification Bell, Avatar, and Dropdown */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handleNotificationsClick} color="inherit">
                    <NotificationsIcon />
                    {unreadCount > 0 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                backgroundColor: 'red',
                                color: 'white',
                                borderRadius: '50%',
                                width: 18,
                                height: 18,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                            }}
                        >
                            {unreadCount}
                        </Box>
                    )}
                </IconButton>

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
                <MenuItem onClick={() => { setTheme(themes.lightTheme); updateThemeInDatabase('lightTheme'); handleClose(); }}>Light Theme</MenuItem>
                <MenuItem onClick={() => { setTheme(themes.darkTheme); updateThemeInDatabase('darkTheme'); handleClose(); }}>Dark Theme</MenuItem>
                <MenuItem onClick={() => { setTheme(themes.defaultTheme); updateThemeInDatabase('defaultTheme'); handleClose(); }}>Default Theme</MenuItem>
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

            {/* Notifications Modal */}
            {isNotificationsOpen && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: '300px',
                        backgroundColor: theme.palette.background.paper,
                        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                        zIndex: 20,
                        padding: 2,
                        overflowY: 'auto',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: theme.palette.text.secondary }}>
                        <NotificationsIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
                        <Button onClick={handleNotificationsClose} sx={{ ml: 'auto' }}>
                            Close
                        </Button>
                    </Box>
                    {notifications.map((notification) => (
                        <Box
                            key={notification.id}
                            sx={{
                                mb: 2,
                                p: 2,
                                backgroundColor: notification.color || theme.palette.grey[300],
                                borderRadius: '8px',
                            }}
                        >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {notification.subject}
                            </Typography>
                            <hr></hr>
                            <Typography variant="body2">{notification.notice}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default TopNav;
