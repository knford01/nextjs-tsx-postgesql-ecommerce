// components/EventViewModal.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    useTheme,
    Grid,
    Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { convertTo12Hour, getDayNames, toUpperCamelCase } from '@/functions/common';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';

interface EventViewModalProps {
    open: boolean;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    event: any;
}

const EventViewModal: React.FC<EventViewModalProps> = ({
    open,
    onClose,
    onEdit,
    onDelete,
    event,
}) => {
    const theme = useTheme();
    const combinedPermissions = useCombinedPermissions();
    const userCanEdit = hasAccess(combinedPermissions, 'calendar', 'edit_calendar');
    // console.log(event);
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box sx={{ backgroundColor: theme.palette.text.primary }}>
                <DialogTitle sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Event Details</DialogTitle>
                <hr style={{ borderColor: theme.palette.warning.main, borderWidth: 2, borderStyle: 'solid' }} />
                <DialogContent sx={{ color: theme.palette.primary.main }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Typography variant="h6">Type of Event:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography>{event?.event_type && toUpperCamelCase(event.event_type)}</Typography>
                        </Grid>

                        {['day', 'all_day'].includes(event?.event_type) && (
                            <>
                                <Grid item xs={4}>
                                    <Typography variant="h6">Date:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{event?.start_date ? new Date(event.start_date.split('T')[0]).toLocaleDateString() : 'Invalid date'}</Typography>
                                </Grid>
                            </>
                        )}

                        {['multi_day', 'recurring'].includes(event?.event_type) && (
                            <>
                                <Grid item xs={4}>
                                    <Typography variant="h6">Start Date:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{event?.start_date ? new Date(event.start_date.split('T')[0]).toLocaleDateString() : 'Invalid date'}</Typography>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant="h6">End Date:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{event?.end_date ? new Date(event.end_date.split('T')[0]).toLocaleDateString() : 'Invalid date'}</Typography>
                                </Grid>
                            </>
                        )}

                        {['day', 'multi_day', 'recurring'].includes(event?.event_type) && (
                            <>
                                <Grid item xs={4}>
                                    <Typography variant="h6">Start Time:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{event?.start_date ? convertTo12Hour(event.start_date.split('T')[1].split('-')[0]) : 'Invalid time'}</Typography>
                                </Grid>

                                <Grid item xs={4}>
                                    <Typography variant="h6">End Time:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{event?.end_date ? convertTo12Hour(event.end_date.split('T')[1].split('-')[0]) : 'Invalid time'}</Typography>
                                </Grid>
                            </>
                        )}

                        {event?.dow && event?.event_type === 'recurring' && (
                            <>
                                <Grid item xs={4}>
                                    <Typography variant="h6">Days:</Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography>{getDayNames(event.dow)}</Typography>
                                </Grid>
                            </>
                        )}

                        <Grid item xs={4}>
                            <Typography variant="h6">Title:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography>{event?.title}</Typography>
                        </Grid>

                        <Grid item xs={4}>
                            <Typography variant="h6">Description:</Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <Typography>{event?.description}</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {userCanEdit && (
                        <>
                            <Button
                                onClick={onEdit}
                                variant="contained"
                                sx={{ backgroundColor: theme.palette.info.main }}
                                startIcon={<EditIcon />}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={onDelete}
                                variant="contained"
                                sx={{ backgroundColor: theme.palette.error.main }}
                                startIcon={<DeleteIcon />}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.warning.main }}
                        startIcon={<CloseIcon />}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default EventViewModal;
