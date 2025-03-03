// src/styles/SearchableSelect.tsx

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { FormControl, InputLabel, FormHelperText } from '@mui/material';
import Select, { Props as SelectProps } from 'react-select';

interface OptionType {
    value: string;
    label: string;
}

interface SearchableSelectProps extends SelectProps<OptionType> {
    label: string;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    onValidationError?: (name: string, isValid: boolean) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    error: externalError,
    helperText,
    required = false,
    value,
    onValidationError,
    name,
    ...props
}) => {
    const theme = useTheme();
    const [localError, setLocalError] = React.useState(false);

    const handleBlur = () => {
        if (required && !value) {
            setLocalError(true);
            onValidationError?.(name || '', false);
        } else {
            setLocalError(false);
            onValidationError?.(name || '', true);
        }
    };

    const customStyles = {
        control: (base: any, state: any) => ({
            ...base,
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.primary.main,
            border: 'none',
            boxShadow: 'none',
            '&:hover': {
                border: 'none',
            },
            height: '2.5em',
            minHeight: 'unset',
            padding: 0,
        }),
        valueContainer: (base: any) => ({
            ...base,
            paddingLeft: '12px',
        }),
        menu: (base: any) => ({
            ...base,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.background.paper,
            zIndex: 1300,
        }),
        menuPortal: (base: any) => ({
            ...base,
            zIndex: 1400, // Higher than MUI dialogs and DataGrid
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

    const [isFocused, setIsFocused] = React.useState(false);

    const shouldShrink = Boolean(value) || isFocused;

    return (
        <FormControl
            fullWidth
            error={localError || externalError}
            sx={{ mt: 1, position: 'relative' }}
        >
            <InputLabel
                shrink={shouldShrink}
                required={required}
                sx={{
                    position: 'absolute',
                    top: shouldShrink ? '-10px' : '50%',
                    left: '12px',
                    transform: shouldShrink ? 'none' : 'translateY(-50%)',
                    fontSize: shouldShrink ? '0.875rem' : '1rem',
                    transition: 'all 0.2s ease',
                }}
            >
                {label}
            </InputLabel>
            <Select
                styles={customStyles}
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    setIsFocused(false);
                    handleBlur();
                }}
                {...props}
                placeholder=""
                components={{
                    IndicatorSeparator: () => null,
                }}
                menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
            />
            {(localError || externalError) && (
                <FormHelperText>
                    {helperText || 'This field is required'}
                </FormHelperText>
            )}
        </FormControl>
    );
};