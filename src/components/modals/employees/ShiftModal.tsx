import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createShift, updateShift } from '@/db/schedule-data';
import { StyledTextField } from '@/styles/StyledTextField';

interface ShiftModalProps {
    open: boolean;
    handleClose: () => void;
    employee: any;
    shift?: any;
    date: any;
    onSave: () => void;
}

const ShiftModal: React.FC<ShiftModalProps> = ({ open, handleClose, employee, shift, date, onSave }) => {
    // console.log("shift: ", shift);
    const theme = useTheme();

    const [sessionUser, setSessionUser] = useState<any>(null);
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                const session = await response.json();
                setSessionUser(session.user);
            } catch (error) {
                showErrorToast('Failed to fetch session');
            }
        };

        checkSession();
    }, []);

    const [shiftInfo, setShiftInfo] = useState({
        start_time: shift?.start_time || '',
        end_time: shift?.end_time || '',
        color: shift?.color || '#4caf50',
        note: shift?.note || '',
    });

    const closeShiftModal = () => {
        setShiftInfo({ start_time: '', end_time: '', color: '#4caf50', note: '' });
        handleClose();
    };

    const [errors, setErrors] = useState({
        start_time: false,
        end_time: false,
    });

    useEffect(() => {
        if (shift) {
            setShiftInfo({
                start_time: shift.start_time || '',
                end_time: shift.end_time || '',
                color: shift.color || '#4caf50',
                note: shift.note || '',
            });
        }
    }, [shift]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShiftInfo((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (!value.trim()) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: true }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
        }
    };

    const handleSubmit = async () => {
        if (!shiftInfo.start_time || !shiftInfo.end_time) {
            setErrors({
                start_time: !shiftInfo.start_time,
                end_time: !shiftInfo.end_time,
            });
            showErrorToast('Please fill out all required fields');
            return;
        }

        try {
            if (shift) {
                await updateShift(shift.id, shiftInfo);
                showSuccessToast('Shift Updated Successfully');
            } else {
                await createShift(employee.id, sessionUser.id, date, shiftInfo);
                showSuccessToast('Shift Created Successfully');
            }
            closeShiftModal();
            onSave();
        } catch (error) {
            showErrorToast('Failed to Save Shift');
        }
    };

    return (
        <Modal open={open} onClose={closeShiftModal}>
            <Paper
                sx={{
                    margin: 'auto',
                    marginTop: '2%',
                    padding: 2,
                    maxWidth: 600,
                    width: '90%',
                    maxHeight: '95vh',
                    overflowY: 'auto',
                    borderRadius: 2,
                }}
            >
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: theme.palette.primary.main }}
                    variant="h6"
                >
                    {shift ? 'Edit Shift' : 'Create Shift'}
                </Typography>

                <StyledTextField
                    label="Employee"
                    name="employee"
                    value={`${employee?.first_name} ${employee?.last_name}`}
                    readOnly
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Date"
                    name="date"
                    value={date}
                    readOnly
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    fullWidth
                    margin="normal"
                    label="Start Time"
                    name="start_time"
                    type="time"
                    value={shiftInfo.start_time}
                    onChange={handleInputChange}
                    required
                    error={errors.start_time}
                    helperText={errors.start_time ? 'Start time is required' : ''}
                />

                <StyledTextField
                    fullWidth
                    margin="normal"
                    label="End Time"
                    name="end_time"
                    type="time"
                    value={shiftInfo.end_time}
                    onChange={handleInputChange}
                    required
                    error={errors.end_time}
                    helperText={errors.end_time ? 'End time is required' : ''}
                />

                <StyledTextField
                    label="Color"
                    name="color"
                    type="color"
                    value={shiftInfo.color}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Note"
                    name="note"
                    value={shiftInfo.note}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                />

                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.success.main,
                            color: theme.palette.text.primary,
                            '&:hover': { backgroundColor: theme.palette.success.dark },
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.warning.main,
                            color: theme.palette.text.primary,
                            '&:hover': { backgroundColor: theme.palette.warning.dark },
                        }}
                        onClick={closeShiftModal}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default ShiftModal;
