import React from 'react';
import { TextField, MenuItem, TextFieldProps, FormControlLabel, Checkbox, styled, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select, { Props as SelectProps, MultiValue, StylesConfig, GroupBase } from 'react-select';

export const StyledTextField = (props: any) => {
    const theme = useTheme();
    const { multiline, type } = props;

    const commonTextFieldStyles = {
        '& .MuiInputBase-root': {
            backgroundColor: `${theme.palette.text.primary} !important`,
            color: `${theme.palette.text.secondary} !important`,
            height: multiline ? 'auto' : '2.5em',
            display: 'flex',
            alignItems: multiline ? 'flex-start' : 'center', // Align text to top for multiline
            padding: multiline ? '10px 8px' : '0 8px', // Extra top and left padding for multiline
        },
        '& .MuiInputBase-input': {
            height: multiline ? 'auto' : '100%',
            boxSizing: 'border-box',
            paddingLeft: '4px', // Ensure slight left padding
        },
        '& .MuiInputLabel-root': {
            color: `${theme.palette.text.secondary} !important`,
            top: type === 'time' ? '-6px' : '50%',
            transform: type === 'time' ? 'translate(14px, 0) scale(0.75)' : 'translate(14px, -50%) scale(1)',
            transition: 'all 0.2s ease',
        },
        '& .MuiInputLabel-shrink': {
            color: `${theme.palette.text.secondary} !important`,
            top: '-6px',
            transform: 'translate(14px, 0) scale(0.75)',
        },
        mt: 1,
    };

    return (
        <TextField
            {...props}
            fullWidth
            variant="outlined"
            sx={commonTextFieldStyles}
        />
    );
};

interface Option {
    value: any;
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
        '& .MuiInputBase-root': {
            backgroundColor: `${theme.palette.text.primary} !important`,
            color: `${theme.palette.text.secondary} !important`,
            height: '2.5em',
            display: 'flex',
            alignItems: 'center',
        },
        '& .MuiInputBase-input': {
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
        },
        '& .MuiInputLabel-root': {
            color: `${theme.palette.text.secondary} !important`,
            top: '50%',
            left: '12px', // Add spacing to the left of the label
            transform: 'translate(0, -50%)', // Vertically center the label
            fontSize: '1rem',
            transition: 'all 0.2s ease',
        },
        '& .MuiInputLabel-shrink': {
            color: `${theme.palette.text.secondary} !important`,
            top: '-6px',
            left: '12px', // Maintain left spacing when label moves to top
            transform: 'translate(0, 0) scale(0.75)', // Move label to top-left when focused or filled
        },
        mt: 1,
    };

    const menuItemStyles = {
        backgroundColor: `${theme.palette.secondary.main} !important`,
        color: `${theme.palette.text.primary} !important`,
        height: '2.5em',
        display: 'flex',
        alignItems: 'center',
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

interface StyledMultiSelectFieldProps {
    label: string;
    name: string;
    value: MultiValue<Option>;
    onChange: (value: MultiValue<Option>) => void;
    options: readonly Option[];
    error?: boolean;
    helperText?: React.ReactNode;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

export const StyledMultiSelectField: React.FC<StyledMultiSelectFieldProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    helperText,
    placeholder = 'Select...',
    required = false,
    disabled = false,
}) => {
    const theme = useTheme();

    const customStyles: StylesConfig<Option, true, GroupBase<Option>> = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: theme.palette.text.primary,
            color: theme.palette.text.secondary,
            borderColor: state.isFocused
                ? theme.palette.primary.main
                : error
                    ? theme.palette.error.main
                    : theme.palette.divider,
            boxShadow: state.isFocused ? `0 0 0 2px ${theme.palette.primary.light}` : 'none',
            '&:hover': {
                borderColor: theme.palette.primary.main,
            },
            height: '2.5em',
            minHeight: 'unset',
            padding: 0,
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0 8px',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: theme.palette.text.secondary,
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: theme.palette.secondary.main,
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: theme.palette.text.primary,
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: theme.palette.error.main,
            ':hover': {
                backgroundColor: theme.palette.error.light,
                color: theme.palette.error.contrastText,
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: theme.palette.secondary.main,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused
                ? theme.palette.primary.main
                : theme.palette.secondary.main,
            color: theme.palette.text.primary,
            fontWeight: 500,
            ':active': {
                backgroundColor: theme.palette.primary.main,
            },
        }),
    };

    const shouldShrink = value.length > 0;

    return (
        <FormControl
            fullWidth
            error={error}
            sx={{ mt: 1, position: 'relative' }}
        >
            <InputLabel
                shrink={shouldShrink}
                required={required}
                sx={{
                    position: 'absolute',
                    top: shouldShrink ? '-10px' : '50%',
                    left: '10px',
                    transform: shouldShrink ? 'none' : 'translateY(-50%)',
                    fontSize: shouldShrink ? '0.875rem' : '1rem',
                    transition: 'all 0.2s ease',
                }}
            >
                {label}
            </InputLabel>
            <Select
                isMulti
                name={name}
                value={value}
                onChange={onChange}
                options={options}
                styles={customStyles}
                placeholder=""
                components={{
                    IndicatorSeparator: () => null,
                }}
                isDisabled={disabled}
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

interface OptionType {
    value: string;
    label: string;
}

interface StyledSearchableSelectProps extends SelectProps<OptionType> {
    label: string;
    error?: boolean;
    helperText?: string;
    required?: boolean; // Add required prop
    onValidationError?: (name: string, isValid: boolean) => void; // Optional callback for form-level validation handling
}

export const StyledSearchableSelect: React.FC<StyledSearchableSelectProps> = ({
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
            border: 'none', // Remove border
            boxShadow: 'none', // Remove shadow
            '&:hover': {
                border: 'none', // Ensure no border appears on hover
            },
            height: '2.5em',
            minHeight: 'unset',
            padding: 0,
        }),
        valueContainer: (base: any) => ({
            ...base,
            paddingLeft: '12px', // Add padding to the left
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

    const shouldShrink = Boolean(value);

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
                onBlur={handleBlur} // Trigger validation on blur
                {...props}
                placeholder=""
                components={{
                    IndicatorSeparator: () => null,
                }}
            />
            {(localError || externalError) && (
                <FormHelperText>
                    {helperText || 'This field is required'}
                </FormHelperText>
            )}
        </FormControl>
    );
};


interface StyledCheckboxProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    label: string;
    checkedColor?: string; // Color of the checkmark when checked
    uncheckedColor?: string; // Color of the checkbox border and checkmark when unchecked
    labelColor?: string; // Color of the label text
}

export const StyledCheckbox: React.FC<StyledCheckboxProps> = ({
    checked,
    onChange,
    name,
    label,
    checkedColor,
    uncheckedColor,
    labelColor
}) => {
    const theme = useTheme();

    // Ensure that the border and checkmark color are controlled directly.
    const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
        '& .MuiSvgIcon-root': {
            color: uncheckedColor || `${theme.palette.text.primary} !important`, // Color of the checkbox when unchecked
            '&.Mui-checked': {
                color: checkedColor || `${theme.palette.primary.main} !important`, // Color of the checkbox when checked
            },
        },
    }));

    const CustomFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
        '& .MuiFormControlLabel-label': {
            color: labelColor || `${theme.palette.text.secondary} !important`, // Label text color
        },
    }));

    return (
        <CustomFormControlLabel
            control={
                <CustomCheckbox
                    checked={checked}
                    onChange={onChange}
                    name={name}
                />
            }
            label={label}
        />
    );
};