import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const StyledTextField = (props: any) => {
    const theme = useTheme();

    const commonTextFieldStyles = {
        InputProps: {
            sx: {
                '& .MuiInputBase-input': {
                    bgcolor: `${theme.palette.text.primary} !important`,
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
    };

    return (
        <TextField
            {...props}
            {...commonTextFieldStyles}
            fullWidth
            variant="outlined"
        />
    );
};

interface Option {
    id: number;
    display: string;
}

interface StyledSelectFieldProps extends Omit<TextFieldProps, 'select' | 'children'> {
    label: string;
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    options: Option[];
    error?: boolean;
    helperText?: React.ReactNode;
}

export const StyledSelectField: React.FC<StyledSelectFieldProps> = ({
    label,
    value,
    onChange,
    options,
    error,
    helperText,
    ...props
}) => {
    const theme = useTheme();

    const selectTextFieldStyles = {
        '& .MuiInputBase-input': {
            backgroundColor: `${theme.palette.text.primary} !important`,
            color: `${theme.palette.primary.main} !important`,
            height: '2.5em',
            padding: '10px 14px',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
        },
        '& .MuiInputLabel-root': {
            color: `${theme.palette.primary.main} !important`,
        },
        '& .MuiInputLabel-shrink': {
            color: `${theme.palette.primary.main} !important`,
            transform: 'translate(.5, -2.5px) scale(0.75)',
        },
        mt: 2,
    };

    const menuItemStyles = {
        color: `${theme.palette.primary.main} !important`,
        '&:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
            color: `${theme.palette.text.primary} !important`,
        },
    };

    return (
        <TextField
            select
            label={label}
            value={value}
            onChange={onChange}
            fullWidth
            error={error}
            helperText={helperText}
            sx={selectTextFieldStyles}
            {...props}
        >
            {options.map((option) => (
                <MenuItem key={option.id} value={option.id} sx={menuItemStyles}>
                    {option.display}
                </MenuItem>
            ))}
        </TextField>
    );
};