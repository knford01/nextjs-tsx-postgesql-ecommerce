import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    useTheme,
    Box,
    styled,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { dateToday, timeNow } from '@/functions/common';

const CustomRadio = styled(Radio)(({ theme }) => ({
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.primary.main,
    padding: 0,
    margin: theme.spacing(0.5),
    '&.Mui-checked': {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.action.selected,
    },
    '&:hover': {
        color: theme.palette.warning.light,
        backgroundColor: theme.palette.warning.light,
    },
}));

interface EventEditModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (event: any) => void;
    event?: any;
    initialDate?: string;
}

const EventEditModal: React.FC<EventEditModalProps> = ({
    open,
    onClose,
    onSave,
    event = {},
    initialDate = '',
}) => {
    const theme = useTheme();
    const router = useRouter();
    const [sessionUser, setSessionUser] = useState<any>();
    const [eventType, setEventType] = useState(event?.event_type || 'day');
    const [formData, setFormData] = useState({
        id: '',
        event_type: '',
        title: '',
        description: '',
        dow: [] as number[],
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        color: '#057dff',
        active: 1,
        user_id: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); // State to hold validation errors

    useEffect(() => {
        const checkSession = async () => {
            const response = await fetch('/api/auth/session');

            if (!response.ok) {
                // console.log('Bad Response');
                router.push('/logout'); // Redirect to the logout page if the session is not valid
            } else {
                const session = await response.json();
                setSessionUser(session.user);
            }
        };

        checkSession();
    }, [router]);

    useEffect(() => {
        if (event) {
            let date;

            if (event.start) {
                date = event.start;
            } else {
                date = dateToday();
            }

            setFormData({
                id: event?.id || '',
                event_type: event?.event_type || 'day',
                title: event?.title || '',
                description: event?.description || '',
                dow: event?.dow ? event.dow.split(',').map(Number) : [],
                start_date: event?.start_date?.split('T')[0] || date,
                end_date: event?.end_date?.split('T')[0] || date,
                start_time: event?.start_date?.split('T')[1]?.split('-')[0] || timeNow(),
                end_time: event?.end_date?.split('T')[1]?.split('-')[0] || timeNow(),
                color: event?.color || '#057dff',
                active: event?.active !== undefined ? event.active : 1,
                user_id: sessionUser?.id || ''
            });
            setEventType(event?.event_type || 'day');
        }
    }, [event, initialDate, sessionUser]);

    const handleInputChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.title) {
            newErrors.title = 'Title is required';
        }
        if (!formData.description) {
            newErrors.description = 'Description is required';
        }
        if (!formData.start_date) {
            newErrors.start_date = 'Start Date is required';
        }
        if ((eventType === 'multi_day' || eventType === 'recurring') && !formData.end_date) {
            newErrors.end_date = 'End Date is required for multi-day or recurring events';
        }
        if (eventType !== 'all_day') {
            if (!formData.start_time) {
                newErrors.start_time = 'Start Time is required';
            }
            if (!formData.end_time) {
                newErrors.end_time = 'End Time is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box sx={{ backgroundColor: theme.palette.text.primary }}>
                <DialogTitle sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    {event?.id ? 'Edit Event' : 'New Event'}
                </DialogTitle>
                <hr style={{ borderColor: theme.palette.warning.main, borderWidth: 2, borderStyle: 'solid' }} />
                <DialogContent sx={{ color: theme.palette.primary.main }}>
                    <FormControl component="fieldset" sx={{ paddingLeft: '8px' }}>
                        <RadioGroup
                            row
                            aria-label="event-type"
                            name="event_type"
                            value={eventType}
                            onChange={(e) => {
                                setEventType(e.target.value);
                                handleInputChange(e);
                            }}
                        >
                            <FormControlLabel value="day" control={<CustomRadio />} label="Day" />
                            <FormControlLabel value="all_day" control={<CustomRadio />} label="All Day" />
                            <FormControlLabel value="multi_day" control={<CustomRadio />} label="Multiple Day" />
                            <FormControlLabel value="recurring" control={<CustomRadio />} label="Recurring" />
                        </RadioGroup>
                    </FormControl>

                    {eventType === 'day' || eventType === 'all_day' ? (
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Date"
                            type="date"
                            name="start_date"
                            value={formData.start_date || dateToday}
                            onChange={handleInputChange}
                            required
                            error={!!errors.start_date}
                            helperText={errors.start_date}
                        />
                    ) : null}

                    {eventType === 'multi_day' || eventType === 'recurring' ? (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Start Date"
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                required
                                error={!!errors.start_date}
                                helperText={errors.start_date}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="End Date"
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                required
                                error={!!errors.end_date}
                                helperText={errors.end_date}
                            />
                        </>
                    ) : null}

                    {eventType !== 'all_day' && (
                        <>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Start Time"
                                type="time"
                                name="start_time"
                                value={formData?.start_time}
                                onChange={handleInputChange}
                                required
                                error={!!errors.start_time}
                                helperText={errors.start_time}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="End Time"
                                type="time"
                                name="end_time"
                                value={formData?.end_time}
                                onChange={handleInputChange}
                                required
                                error={!!errors.end_time}
                                helperText={errors.end_time}
                            />
                        </>
                    )}

                    {eventType === 'recurring' && (
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Days of the Week</InputLabel>
                            <Select
                                multiple
                                name="dow"
                                value={formData.dow}
                                onChange={handleSelectChange}
                            >
                                <MenuItem value={0}>Sunday</MenuItem>
                                <MenuItem value={1}>Monday</MenuItem>
                                <MenuItem value={2}>Tuesday</MenuItem>
                                <MenuItem value={3}>Wednesday</MenuItem>
                                <MenuItem value={4}>Thursday</MenuItem>
                                <MenuItem value={5}>Friday</MenuItem>
                                <MenuItem value={6}>Saturday</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        error={!!errors.description}
                        helperText={errors.description}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Color"
                        type="color"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        required
                    />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="active"
                            value={formData.active}
                            onChange={handleSelectChange}
                            required
                        >
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={0}>Disabled</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.success.main }}
                        startIcon={<EditIcon />}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{ backgroundColor: theme.palette.warning.main }}
                        startIcon={<CloseIcon />}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default EventEditModal;
