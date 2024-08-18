// src/pages/403.tsx

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const ForbiddenPage: React.FC = () => {
    const router = useRouter();

    return (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h1" component="h1" gutterBottom>
                403 - Forbidden
            </Typography>
            <Typography variant="h6" component="h2" gutterBottom>
                You do not have access to this page.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => router.push('/')}>
                Go Back to Home
            </Button>
        </Box>
    );
};

export default ForbiddenPage;
