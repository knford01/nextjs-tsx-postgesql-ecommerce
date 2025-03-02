import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledTextField } from '@/styles/StyledTextField';
import { showErrorToast } from '@/components/ui/ButteredToast';
import { fetchReceivingById } from '@/db/receiving-data';

interface StagingModalProps {
    open: boolean;
    handleClose: () => void;
    receivingID?: number;
    loadStaging: () => void;
}

const StagingModal: React.FC<StagingModalProps> = ({ open, handleClose, receivingID, loadStaging }) => {
    const theme = useTheme();

    const emptyReceivingData = useMemo(() => ({
        customer_name: '',
        project_name: '',
        bol: '',
        po_number: ''
    }), []);

    const [receivingData, setReceivingData] = useState(emptyReceivingData);

    useEffect(() => {
        if (receivingID) {
            const loadReceivingData = async () => {
                try {
                    const data = await fetchReceivingById(receivingID);
                    setReceivingData(data);
                } catch (error) {
                    showErrorToast('Failed to load receiving data');
                }
            };
            loadReceivingData();
        } else {
            setReceivingData(emptyReceivingData);
        }
    }, [receivingID, emptyReceivingData]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 600 }}>
                <Typography
                    sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    Staging
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: `${theme.palette.text.primary}`,
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.default,
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Details
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledTextField
                                label="Customer Name"
                                value={receivingData.customer_name}
                                InputProps={{ readOnly: true }}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <StyledTextField
                                label="Project Name"
                                value={receivingData.project_name}
                                InputProps={{ readOnly: true }}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledTextField
                                label="BOL"
                                value={receivingData.bol}
                                InputProps={{ readOnly: true }}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <StyledTextField
                                label="PO Number"
                                value={receivingData.po_number}
                                InputProps={{ readOnly: true }}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: `${theme.palette.text.primary}`,
                            textAlign: 'center',
                            backgroundColor: theme.palette.background.default,
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        Received
                    </Typography>
                </Box>

                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.warning.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.success.dark} !important` },
                        }}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default StagingModal;
