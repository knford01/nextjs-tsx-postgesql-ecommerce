// app/themes.ts

import { createTheme } from '@mui/material/styles';
import type { } from '@mui/x-data-grid/themeAugmentation';

export const lightTheme = createTheme({
    palette: {
        action: {
            hover: '#e0f7fa', // Light teal for hover
            selected: '#b2ebf2', // Slightly darker teal for selected
        },
        background: {
            default: '#ffffff', // White for default background
            paper: '#f5f5f5', // Light gray for paper background
        },
        primary: {
            main: '#64b5f6', // Light blue for primary color
        },
        secondary: {
            main: '#81c784', // Light green for secondary color
        },
        text: {
            primary: '#ffffff', // Black for primary text
            secondary: '#333333', // Dark gray for secondary text
        },
        error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828'
        },
        info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b'
        },
        success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20'
        },
        warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100'
        }
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff', // White background for DataGrid
                    color: '#000000', // Black text color for DataGrid
                },
                columnHeaders: {
                    backgroundColor: '#f5f5f5', // Light gray for column headers
                    '& .MuiDataGrid-columnHeaderTitle': {
                        color: '#000000', // Black text color for column headers
                    },
                },
                footerContainer: {
                    backgroundColor: '#f5f5f5', // Light gray for footer container
                },
                checkboxInput: {
                    color: '#000000', // Black for checkbox
                    '&.Mui-checked': {
                        color: '#64b5f6', // Light blue for checked checkbox
                    },
                },
                menu: {
                    '& .MuiPaper-root': {
                        backgroundColor: '#ffffff', // White for menu background
                        color: '#000000', // Black text color for menu
                    },
                },
                row: {
                    '&.Mui-selected': {
                        backgroundColor: '#b2ebf2',
                        '&:hover': {
                            backgroundColor: '#b2ebf2', // Ensure the background remains the same on hover
                        },
                    },
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: '#ffffff', // Black for SVG icons
                },
            },
        },
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    color: '#000000', // Black for pagination items
                    '&.Mui-selected': {
                        backgroundColor: '#b2ebf2', // Light teal for selected pagination item
                    },
                },
            },
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    color: '#000000', // Black for buttons
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    backgroundColor: '#81c784', // Light green for contained buttons
                    color: '#ffffff', // White text color for contained buttons
                    '&:hover': {
                        backgroundColor: '#66bb6a', // Darker green for hover state
                    },
                },
            },
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        action: {
            hover: '#333333', // Dark gray for hover
            selected: '#444444', // Slightly lighter gray for selected
        },
        background: {
            default: '#121212', // Very dark gray for default background
            paper: '#1e1e1e', // Dark gray for paper background
        },
        primary: {
            main: '#320b86', // Very dark purple for primary color
        },
        secondary: {
            main: '#00796b', // Dark green for secondary color
        },
        text: {
            primary: '#ffffff', // White for primary text
            secondary: '#aaaaaa', // Light gray for secondary text
        },
        error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828'
        },
        info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b'
        },
        success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20'
        },
        warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100'
        }
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1e1e1e', // Dark gray background for DataGrid
                    color: '#ffffff', // White text color for DataGrid
                },
                columnHeaders: {
                    backgroundColor: '#2c2c2c', // Slightly lighter dark gray for column headers
                    '& .MuiDataGrid-columnHeaderTitle': {
                        color: '#ffffff', // White text color for column headers
                    },
                },
                footerContainer: {
                    backgroundColor: '#2c2c2c', // Slightly lighter dark gray for footer container
                },
                checkboxInput: {
                    color: '#ffffff', // White for checkbox
                    '&.Mui-checked': {
                        color: '#5e35b1', // Dark purple for checked checkbox
                    },
                },
                menu: {
                    '& .MuiPaper-root': {
                        backgroundColor: '#2c2c2c', // Dark gray for menu background
                        color: '#ffffff', // White text color for menu
                    },
                },
                row: {
                    '&.Mui-selected': {
                        backgroundColor: '#444444',
                        '&:hover': {
                            backgroundColor: '#444444', // Ensure the background remains the same on hover
                        },
                    },
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: '#ffffff', // White for SVG icons
                },
            },
        },
        MuiPaginationItem: {
            styleOverrides: {
                root: {
                    color: '#ffffff', // White for pagination items
                    '&.Mui-selected': {
                        backgroundColor: '#444444', // Dark gray for selected pagination item
                    },
                },
            },
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    color: '#ffffff', // White for buttons
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                contained: {
                    backgroundColor: '#5e35b1', // Dark purple for contained buttons
                    color: '#ffffff', // White text color for contained buttons
                    '&:hover': {
                        backgroundColor: '#4527a0', // Darker purple for hover state
                    },
                },
            },
        },
    },
});

export const defaultTheme = createTheme({
    palette: {
        action: {
            hover: '#022140',
            selected: '#494B68',
        },
        background: {
            default: '#022140',
            paper: '#e8e8e8',
        },
        primary: {
            main: '#1E4258',
        },
        secondary: {
            main: '#265077',
        },
        text: {
            primary: '#ffffff',
            secondary: '#ffffff',
        },
        error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828'
        },
        info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b'
        },
        success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20'
        },
        warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100'
        }
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: '#1E4258',
                    color: '#ffffff',
                },
                columnHeaders: {
                    backgroundColor: '#022140',
                    '& .MuiDataGrid-columnHeaderTitle': {
                        color: '#ffffff',
                    },
                },
                footerContainer: {
                    backgroundColor: '#022140',
                },
                checkboxInput: {
                    color: '#ffffff',
                    '&.Mui-checked': {
                        color: '#ffffff',
                    },
                },
                menu: {
                    '& .MuiPaper-root': {
                        backgroundColor: '#265077',
                        color: '#ffffff',
                    },
                },
                row: {
                    '&.Mui-selected': {
                        backgroundColor: '#494B68',
                        '&:hover': {
                            backgroundColor: '#494B68',
                        },
                    },
                },
            },
        },

        MuiPopover: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#265077', // Background color of the popover (filter box)
                    color: '#ffffff', // Text color inside the popover
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-root': {
                        color: '#1E4258', // Input text color in filter panel
                    },
                    '& .MuiButtonBase-root': {
                        color: '#ffffff', // Button color in filter panel
                    },
                },
            },
        },

        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                },
            },
        },

        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: '#ffffff', // Color of the down arrow icon in the select component
                },
            },
        },

        MuiTabs: {
            styleOverrides: {
                indicator: {
                    // Indicator styling for the selected tab
                    backgroundColor: '#1E4258', // You can change the indicator color here
                },
            },
        },

        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Disable uppercase transformation
                    fontWeight: 500, // Default weight for inactive tabs
                    color: '#265077', // Inactive tab color
                    '&.Mui-selected': {
                        fontWeight: 700, // Bold font for active tab
                        color: '#1E4258', // Active tab color
                    },
                },
            },
        },
    },
});
