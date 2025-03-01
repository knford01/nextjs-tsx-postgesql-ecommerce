import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { createSchedule, updateSchedule } from '@/db/schedule-data';
import { StyledTextField } from '@/styles/StyledTextField';
import { format } from 'date-fns';

interface ShiftModalProps {
    open: boolean;
    handleClose: () => void;
    employee: any;
    schedule?: any;
    date: any;
    onSave: () => void;
}

const ShiftModal: React.FC<ShiftModalProps> = ({ open, handleClose, employee, schedule, date, onSave }) => {
    const theme = useTheme();

    const [scheduleInfo, setScheduleInfo] = useState({
        start_time: schedule?.start_time || '',
        end_time: schedule?.end_time || '',
        color: schedule?.color || '#4caf50',
        notes: schedule?.notes || '',
    });

    const [errors, setErrors] = useState({
        start_time: false,
        end_time: false,
    });

    useEffect(() => {
        if (schedule) {
            setScheduleInfo({
                start_time: schedule.start_time || '',
                end_time: schedule.end_time || '',
                color: schedule.color || '#4caf50',
                notes: schedule.notes || '',
            });
        }
    }, [schedule]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setScheduleInfo((prevData) => ({
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
        if (!scheduleInfo.start_time || !scheduleInfo.end_time) {
            setErrors({
                start_time: !scheduleInfo.start_time,
                end_time: !scheduleInfo.end_time,
            });
            showErrorToast('Please fill out all required fields');
            return;
        }

        try {
            if (schedule) {
                // await updateSchedule(schedule.id, scheduleInfo);
                showSuccessToast('Schedule Updated Successfully');
            } else {
                // await createSchedule(employee.id, { ...scheduleInfo, date });
                showSuccessToast('Schedule Created Successfully');
            }
            handleClose();
            onSave();
        } catch (error) {
            showErrorToast('Failed to Save Schedule');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
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
                    {schedule ? 'Edit Shift' : 'Create Shift'}
                </Typography>

                <StyledTextField
                    label="Employee"
                    name="employee"
                    value={`${employee.first_name} ${employee.last_name}`}
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
                    value={scheduleInfo.start_time}
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
                    value={scheduleInfo.end_time}
                    onChange={handleInputChange}
                    required
                    error={errors.end_time}
                    helperText={errors.end_time ? 'End time is required' : ''}
                />

                <StyledTextField
                    label="Color"
                    name="color"
                    type="color"
                    value={scheduleInfo.color}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />

                <StyledTextField
                    label="Notes"
                    name="notes"
                    value={scheduleInfo.notes}
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
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default ShiftModal;
