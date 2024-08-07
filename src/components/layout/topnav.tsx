// src/components/layout/topnav.tsx

'use client';

import React, { useState } from 'react';
import { FC } from 'react';
import { Box, IconButton, Menu, MenuItem, Avatar, Typography, useTheme } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { useThemeContext } from '@/app/navigation/layout';
import { lightTheme, darkTheme, defaultTheme } from './themes';
import { COMPANY_NAME } from '@/constants/appConstants';
import { setUserTheme } from '@/db/user-data';
import useSession from '@/hooks/useSession';
import { UserModal } from '../modals/UserModals';

interface TopNavProps {
    collapsed: boolean;
}

const TopNav: FC<TopNavProps> = ({ collapsed }) => {
    const theme = useTheme(); // Use the useTheme hook here
    const { user } = useSession();
    const userId = user?.id;
    const userName = user?.first_name || 'User';

    const { setTheme } = useThemeContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

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

    const handleSubmit = (data: any) => {
        console.log('Update User Data:', data);
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
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', pl: 2 }}>
                <h1 className="text-lg font-bold">{COMPANY_NAME}</h1>
            </Box>

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
                    Hello, {userName}
                </Typography>
                <IconButton
                    sx={{
                        padding: 0, // remove extra padding from icon button
                    }}
                    color="inherit"
                >
                    {user?.avatar ? (
                        <Avatar
                            src={user.avatar}
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
                    row={user}
                />
            )}
        </Box>
    );
};

export default TopNav;
