import React from 'react';
import { TextField, MenuItem, TextFieldProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select, { Props as SelectProps } from 'react-select';

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
    value: number | string;
    display: string;
}

interface StyledSelectFieldProps extends Omit<TextFieldProps, 'select' | 'children'> {
    label: string;
    value: any;
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
        mt: 1,
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
                <MenuItem key={option.value} value={option.value} sx={menuItemStyles}>
                    {option.display}
                </MenuItem>
            ))}
        </TextField>
    );
};

interface OptionType {
    value: string;
    label: string;
}

interface StyledSearchableSelectProps extends SelectProps<OptionType> {
    error?: boolean;
    helperText?: string;
}

const StyledSearchableSelect: React.FC<StyledSearchableSelectProps> = ({ error, helperText, ...props }) => {
    const theme = useTheme();

    const customStyles = {
        control: (base: any, state: any) => ({
            ...base,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.text.primary,
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
            '&:hover': {
                borderColor: error ? theme.palette.error.dark : theme.palette.primary.light,
            },
            boxShadow: state.isFocused ? `0 0 0 1px ${theme.palette.primary.main}` : base.boxShadow,
            '&:focus': {
                borderColor: theme.palette.primary.main,
            },
        }),
        menu: (base: any) => ({
            ...base,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.background.paper,
            zIndex: 9999,
        }),
        option: (base: any, state: any) => ({
            ...base,
            color: state.isSelected
                ? theme.palette.text.primary
                : theme.palette.primary.main,
            backgroundColor: state.isSelected
                ? theme.palette.action.selected
                : base.backgroundColor,
            '&:hover': {
                backgroundColor: state.isSelected
                    ? theme.palette.primary.dark
                    : theme.palette.action.hover,
                color: state.isSelected
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
            },
        }),
        singleValue: (base: any) => ({
            ...base,
            color: theme.palette.primary.main,
        }),
    };

    return (
        <div style={{ marginTop: '16px', color: theme.palette.primary.main }}>
            <Select
                styles={customStyles}
                {...props}
            />
            {helperText && (
                <div style={{ color: theme.palette.error.main, marginTop: '4px', fontSize: '0.75rem' }}>
                    {helperText}
                </div>
            )}
        </div>
    );
};

export default StyledSearchableSelect;