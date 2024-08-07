// src/ components/layout/topnav.tsx

'use client';

import React from 'react';
import { FC } from 'react';
import { Box, IconButton, Menu, MenuItem, useTheme } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { useThemeContext } from '@/app/navigation/layout';
import { lightTheme, darkTheme, defaultTheme } from './themes';
import { COMPANY_NAME } from '@/constants/appConstants';
import { setUserTheme } from '@/db/user-data';
import useSession from '@/hooks/useSession';

interface TopNavProps {
    collapsed: boolean;
}

const TopNav: FC<TopNavProps> = ({ collapsed }) => {
    const { user } = useSession();
    let userId = user?.id;

    const { setTheme } = useThemeContext();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const theme = useTheme();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
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
            <IconButton
                onClick={handleClick}
                color="inherit"
                sx={{
                    mr: 2,
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                        color: theme.palette.text.secondary,
                    },
                }}
            >
                <PaletteIcon />
            </IconButton>
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
        </Box>
    );
};

export default TopNav;
