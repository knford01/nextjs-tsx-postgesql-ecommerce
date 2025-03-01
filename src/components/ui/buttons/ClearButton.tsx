// src/components/ui/buttons/ClearButton

import React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

interface ClearButtonProps {
    onClick: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onClick }) => {
    const theme = useTheme();

    return (
        <Button
            variant="contained"
            sx={{
                backgroundColor: `${theme.palette.warning.main} !important`,
                color: `${theme.palette.text.primary} !important`,
                '&:hover': { backgroundColor: `${theme.palette.warning.dark} !important` }
            }}
            onClick={onClick}
        >
            Clear
        </Button>
    );
};

export default ClearButton;
