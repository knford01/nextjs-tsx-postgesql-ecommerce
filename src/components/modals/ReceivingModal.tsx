import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledSelectField, StyledTextField } from '@/styles/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { fetchReceivingById, createReceiving, updateReceiving, fetchActiveReceivingStatuses } from '@/db/receiving-data';
import { fetchCustomers } from '@/db/customer-data';
import { fetchProjectsByCustomerId } from '@/db/project-data';
import { fetchActiveCarriers } from '@/db/warehouse-data';

interface ReceivingModalProps {
    open: boolean;
    handleClose: () => void;
    warehouseID?: number;
    receivingID?: number;
    loadStaging: () => void;
}

const ReceivingModal: React.FC<ReceivingModalProps> = ({ open, handleClose, warehouseID, receivingID, loadStaging }) => {
    const theme = useTheme();

    const emptyReceivingData = useMemo(() => ({
        customer_id: '' as any,
        project_id: '' as any,
        status_id: '' as any,
        carrier_id: '' as any,
        user_id: '' as any,
        start_date: '',
        bol: '',
        po_number: '',
        seal: '',
        comment: '',
    }), []);

    const [sessionUser, setSessionUser] = useState<any>();
    const [receivingData, setReceivingData] = useState<any>(emptyReceivingData);
    const [customers, setCustomers] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [carriers, setCarriers] = useState<any[]>([]);
    const [statuses, setStatuses] = useState<any[]>([]);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                setSessionUser(session.user);
            } catch (error) {
                showErrorToast('Failed to fetching session');
            }
        };

        const loadCustomers = async () => {
            try {
                const data = await fetchCustomers();
                setCustomers(data.map((customer: any) => ({ value: customer.id.toString(), display: customer.name })));
            } catch (error) {
                showErrorToast('Failed to load customers');
            }
        };

        const loadCarriers = async () => {
            try {
                const data = await fetchActiveCarriers();
                setCarriers(data.map((carrier: any) => ({ value: carrier.id.toString(), display: carrier.name })));
            } catch (error) {
                showErrorToast('Failed to load Carriers');
            }
        };

        const loadStatuses = async () => {
            try {
                const data = await fetchActiveReceivingStatuses();
                setStatuses(data.map((status: any) => ({ value: status.id.toString(), display: status.name })));
            } catch (error) {
                showErrorToast('Failed to load Statuses');
            }
        };

        const loadReceivingData = async () => {
            console.log('receivingID: ', receivingID);
            if (receivingID) {
                try {
                    const data = await fetchReceivingById(receivingID);
                    setReceivingData({
                        ...data,
                        customer_id: data.customer_id.toString(),
                        project_id: data.project_id.toString(),
                        user_id: data.user_id.toString(),
                    });
                    populateProjects(data.customer_id);
                } catch (error) {
                    showErrorToast('Failed to load receiving data');
                }
            } else {
                setReceivingData(emptyReceivingData);
            }
        };

        if (open) {
            checkSession();
            loadCustomers();
            loadCarriers();
            loadStatuses();
            loadReceivingData();
        } else {
            setReceivingData(emptyReceivingData);
            setProjects([]);
        }
    }, [open, receivingID, emptyReceivingData]);

    const populateProjects = async (customerId: any) => {
        if (customerId) {
            try {
                const projectData = await fetchProjectsByCustomerId(customerId);
                setProjects(projectData.map((project: any) => ({ display: project.name, value: project.id })));
            } catch (error) {
                showErrorToast('Failed to load projects');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setReceivingData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'customer_id') {
            populateProjects(parseInt(value));
        }
    };

    const handleSubmit = async () => {
        const requiredFields = ['customer_id', 'project_id'];

        const hasErrors = requiredFields.some((field) => {
            const value = receivingData[field];
            return typeof value === 'string' && value.trim() === '';
        });

        if (hasErrors) {
            showErrorToast('Please fill out all required fields');
            return;
        }

        try {
            if (receivingID) {
                await updateReceiving(receivingID, receivingData);
                showSuccessToast('Receiving Updated Successfully');
            } else {
                await createReceiving(sessionUser.id, warehouseID, receivingData);
                showSuccessToast('Receiving Created Successfully');
            }
            handleModalClose();
            loadStaging();
        } catch (error) {
            showErrorToast('Failed to Save Receiving');
        }
    };

    const handleModalClose = () => {
        setReceivingData(emptyReceivingData);
        setProjects([]);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleModalClose} sx={{ overflowY: 'scroll' }}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 800 }}>
                <Typography
                    sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {receivingID ? 'Edit Receiving' : 'Create Receiving'}
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
                        Assignment
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledSelectField
                                label="Customer"
                                name="customer_id"
                                value={receivingData.customer_id}
                                onChange={handleInputChange}
                                options={customers}
                                required
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <StyledSelectField
                                label="Project"
                                name="project_id"
                                value={receivingData.project_id}
                                onChange={handleInputChange}
                                options={projects}
                                required
                                disabled={!receivingData.customer_id}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <StyledSelectField
                                label="Carrier"
                                name="carrier_id"
                                value={receivingData.carrier_id}
                                onChange={handleInputChange}
                                options={carriers}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <StyledSelectField
                                label="Status"
                                name="status_id"
                                value={receivingData.status_id}
                                onChange={handleInputChange}
                                options={statuses}
                                required
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
                        Details
                    </Typography>

                    <Box sx={{ mb: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <StyledTextField
                                    label="Receiving Date"
                                    name="start_date"
                                    value={receivingData.start_date}
                                    onChange={handleInputChange}
                                    type="date" // Add this attribute
                                    InputLabelProps={{
                                        shrink: true, // Ensures the label stays visible for the date picker
                                    }}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <StyledTextField
                                    label="Seal"
                                    name="seal"
                                    value={receivingData.seal}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <StyledTextField
                                    label="PO Number"
                                    name="po_number"
                                    value={receivingData.po_number}
                                    onChange={handleInputChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <StyledTextField
                                    label="BOL"
                                    name="bol"
                                    value={receivingData.bol}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <StyledTextField
                                    label="Comment"
                                    name="comment"
                                    value={receivingData.comment}
                                    onChange={handleInputChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.success.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.success.dark} !important` },
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.warning.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.warning.dark} !important` },
                        }}
                        onClick={handleModalClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal >
    );
};

export default ReceivingModal;
