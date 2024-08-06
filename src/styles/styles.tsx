import { Theme } from '@mui/material/styles';

export const createCommonTextFieldStyles = (theme: Theme) => ({
    InputProps: {
        sx: {
            '& .MuiInputBase-input': {
                color: `${theme.palette.primary.main} !important`,
                height: '2.5em',
                padding: '10px 14px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
            },
        },
    },
    InputLabelProps: {
        sx: {
            '&.MuiInputLabel-shrink': {
                color: `${theme.palette.primary.main} !important`,
                transform: 'translate(.5, -2.5px) scale(0.75)',
            },
            '&:not(.MuiInputLabel-shrink)': {
                transform: 'translate(14px, 10px) scale(1)',
            },
        },
    },
    sx: {
        mt: 2,
        '& .MuiInputLabel-root': {
            color: `${theme.palette.primary.main} !important`,
        },
    },
});

export const createSelectTextFieldStyles = (theme: Theme) => ({
    ...createCommonTextFieldStyles(theme),
    SelectProps: {
        MenuProps: {
            PaperProps: {
                sx: {
                    bgcolor: `${theme.palette.background.paper} !important`,
                    '& .MuiMenuItem-root': {
                        color: `${theme.palette.primary.main} !important`,
                        '&:hover': {
                            bgcolor: `${theme.palette.action.hover} !important`,
                            color: `${theme.palette.text.primary} !important`,
                        },
                    },
                },
            },
        },
        sx: {
            backgroundColor: `${theme.palette.background.paper} !important`,
            color: `${theme.palette.primary.main} !important`,
            height: '2.5em',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            '& .MuiSelect-select': {
                color: `${theme.palette.primary.main} !important`,
            },
        },
    },
});
