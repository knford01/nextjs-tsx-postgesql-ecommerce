// app/themes.ts

import { createTheme } from '@mui/material/styles';
import type { } from '@mui/x-data-grid/themeAugmentation';

// Define color variables for customizable themes
const colors = {
    lightTheme: {
        primaryMain: '#64b5f6',
        secondaryMain: '#1976d2',
        actionHover: '#e3f2fd',
        actionSelected: '#bbdefb',
        backgroundPaper: '#ffffff',
        borderBottom: '#d8d8d8',
        textPrimary: '#ffffff',
    },
    darkTheme: {
        primaryMain: '#320b86',
        secondaryMain: '#022140',
        actionHover: '#37474f',
        actionSelected: '#546e7a',
        backgroundPaper: '#263238',
        borderBottom: '#b0bec5',
        textPrimary: '#ffffff',
    },
    defaultTheme: {
        primaryMain: '#1E4258',
        secondaryMain: '#265077',
        actionHover: '#022140',
        actionSelected: '#494B68',
        backgroundPaper: '#e8e8e8',
        borderBottom: '#d8d8d8',
        textPrimary: '#ffffff',
    },
};

// Function to create a theme
const createAppTheme = (themeColors: typeof colors.lightTheme) =>
    createTheme({
        palette: {
            action: {
                hover: themeColors.actionHover,
                selected: themeColors.actionSelected,
            },
            background: {
                default: themeColors.borderBottom,
                paper: themeColors.backgroundPaper,
            },
            primary: {
                main: themeColors.primaryMain,
            },
            secondary: {
                main: themeColors.secondaryMain,
            },
            text: {
                primary: themeColors.textPrimary,
                secondary: themeColors.primaryMain,
            },
            // Hard-coded colors for error, info, success, and warning
            error: {
                main: '#d32f2f',
                light: '#ef5350',
                dark: '#c62828',
            },
            info: {
                main: '#0288d1',
                light: '#03a9f4',
                dark: '#01579b',
            },
            success: {
                main: '#2e7d32',
                light: '#4caf50',
                dark: '#1b5e20',
            },
            warning: {
                main: '#ed6c02',
                light: '#ff9800',
                dark: '#e65100',
            },
        },
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        backgroundColor: themeColors.primaryMain,
                        color: themeColors.textPrimary,
                    },
                    columnHeaders: {
                        backgroundColor: themeColors.actionHover,
                        '& .MuiDataGrid-columnHeaderTitle': {
                            color: themeColors.textPrimary,
                        },
                    },
                    footerContainer: {
                        backgroundColor: themeColors.actionHover,
                    },
                    checkboxInput: {
                        color: themeColors.textPrimary,
                        '&.Mui-checked': {
                            color: themeColors.textPrimary,
                        },
                    },
                    menu: {
                        '& .MuiPaper-root': {
                            backgroundColor: themeColors.secondaryMain,
                            color: themeColors.textPrimary,
                        },
                    },
                    row: {
                        '&.Mui-selected': {
                            backgroundColor: themeColors.actionSelected,
                            '&:hover': {
                                backgroundColor: themeColors.actionSelected,
                            },
                        },
                    },
                },
            },
            MuiPopover: {
                styleOverrides: {
                    paper: {
                        backgroundColor: themeColors.secondaryMain,
                        color: themeColors.textPrimary,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        '& .MuiInputBase-root': {
                            color: themeColors.primaryMain,
                        },
                        '& .MuiButtonBase-root': {
                            color: themeColors.textPrimary,
                        },
                    },
                },
            },
            MuiSvgIcon: {
                styleOverrides: {
                    root: {
                        color: themeColors.textPrimary,
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    icon: {
                        color: themeColors.textPrimary,
                    },
                },
            },
            MuiTabs: {
                styleOverrides: {
                    indicator: {
                        backgroundColor: themeColors.primaryMain,
                    },
                    flexContainer: {
                        borderBottom: `2px solid ${themeColors.borderBottom}`,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 500,
                        color: themeColors.secondaryMain,
                        borderBottom: '2px solid transparent',
                        '&:not(.Mui-selected)': {
                            borderBottom: `2px solid ${themeColors.borderBottom}`,
                        },
                        '&.Mui-selected': {
                            fontWeight: 700,
                            color: themeColors.primaryMain,
                            borderBottom: `2px solid ${themeColors.primaryMain}`,
                        },
                    },
                },
            },
        },
    });

// Create themes
export const themes = Object.keys(colors).reduce((acc, themeName) => {
    acc[themeName] = createAppTheme(colors[themeName as keyof typeof colors]);
    return acc;
}, {} as Record<string, ReturnType<typeof createTheme>>);

