'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, IconButton, Menu, MenuItem, Avatar, Typography, useTheme, Button, TextField, InputAdornment, useMediaQuery } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import StopIcon from '@mui/icons-material/Stop';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeContext } from '@/app/navigation/layout';
import { themes } from './themes';
import { fetchUserAvatar, setUserTheme } from '@/db/user-data';
import { UserModal } from '../modals/users/UserModal';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { fetchNotifications } from '@/db/notification-data';

interface TopNavProps {
    collapsed: boolean;
    sessionUser: any;
    checkSession: () => Promise<void>;
}

const TopNav: React.FC<TopNavProps> = ({ collapsed, sessionUser, checkSession }) => {

    const theme = useTheme();
    const { setTheme } = useThemeContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [session, setSession] = useState<any>([]);
    const [notifications, setNotifications] = useState<Notice[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [avatar, setAvatar] = useState('');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchExpanded, setSearchExpanded] = useState(false);

    useEffect(() => {
        // console.log('sessionUser :', sessionUser);
        setSession(sessionUser);
        const fetchAvatar = async () => {
            const data = await fetchUserAvatar(sessionUser?.id);
            if (data?.avatar) {
                setAvatar(data.avatar);
                setSession((prevSession: any) => ({
                    ...prevSession,
                    avatar: data.avatar,
                }));
            }
        };
        fetchAvatar();
    }, [sessionUser]);

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

    const userId = session?.id;
    const userName = session?.first_name || 'User';
    const greeting = session?.emulating_user_id ? 'Emulating' : 'Hello';

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
        if (session?.emulating_user_id) {
            await fetch('/api/auth/emulate', {
                method: 'POST',
                body: JSON.stringify({ emulate: false, emulating_user: session }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            checkSession();
        }
        handleMenuClose();
    };

    const handleSubmit = (data: any) => {
        checkSession();
        handleUserModalClose();
    };

    const toggleSearch = () => {
        setSearchExpanded(prev => !prev);
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
                width: `calc(100% - ${collapsed ? '64px' : '240px'})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '56px',
                transition: 'all 0.3s',
                zIndex: 10,
                marginLeft: collapsed ? '64px' : '240px',
                paddingRight: '16px',
            }}
        >
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={toggleSearch} color="inherit">
                    {searchExpanded ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
                {searchExpanded && (
                    <TextField
                        placeholder="Search..."
                        variant="outlined"
                        sx={{
                            width: isMobile ? '100px' : '550px',
                            ml: 1,
                            height: '36px', // Adjust this value as needed for your design
                            '& .MuiOutlinedInput-root': {
                                height: '100%', // Ensures the input field respects the specified height
                                borderRadius: '5px', // Rounded corners for aesthetic
                            },
                            '& .MuiInputBase-input': {
                                padding: '8px', // Adjust padding to fine-tune text positioning
                                fontSize: '0.875rem', // Adjust font size as needed
                            },
                        }}
                        InputProps={{
                            style: {
                                color: theme.palette.text.secondary,
                                backgroundColor: theme.palette.background.paper,
                                fontWeight: 'bold',
                            },
                        }}
                    />
                )}
            </Box>

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
                            padding: 0,
                        }}
                        color="inherit"
                    >
                        {avatar ? (
                            <Avatar
                                src={avatar}
                                alt={`${userName}'s avatar`}
                                sx={{ width: 35, height: 35 }}
                            />
                        ) : (
                            <AccountCircleIcon sx={{ width: 35, height: 35 }} />
                        )}
                    </IconButton>
                </Box>
            </Box>

            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                    },
                }}
            >
                {session?.emulating_user_id && (
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

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                    },
                }}
            >
                <MenuItem onClick={() => { setTheme(themes.lightTheme); updateThemeInDatabase('lightTheme'); handleClose(); }}>Light Theme</MenuItem>
                <MenuItem onClick={() => { setTheme(themes.darkTheme); updateThemeInDatabase('darkTheme'); handleClose(); }}>Dark Theme</MenuItem>
                <MenuItem onClick={() => { setTheme(themes.defaultTheme); updateThemeInDatabase('defaultTheme'); handleClose(); }}>Default Theme</MenuItem>
            </Menu>

            {userId && (
                <UserModal
                    open={isUserModalOpen}
                    onClose={handleUserModalClose}
                    onSubmit={handleSubmit}
                    id={userId}
                    row={session}
                />
            )}

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
                                p: 1,
                                backgroundColor: theme.palette.background.level1,
                                color: theme.palette.primary.main,
                                borderRadius: '8px',
                            }}
                        >
                            <Box sx={{ backgroundColor: theme.palette.background.level1, borderRadius: 1, p: 1, }}>
                                <Typography variant="subtitle1" sx={{ mr: 1, fontWeight: 'bold' }}>
                                    <NotificationsIcon sx={{ color: notification.color || '' }} />
                                    {notification.subject}
                                </Typography>
                            </Box>

                            <Box sx={{ backgroundColor: theme.palette.text.primary, borderRadius: 1, p: 1, }}>
                                <Typography variant="body2">{notification.notice}</Typography>
                            </Box>
                        </Box>
                    ))}

                </Box>
            )}
        </Box>
    );
};

export default TopNav;
