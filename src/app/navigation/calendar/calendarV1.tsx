// src/app/navigation/calendar/page.tsx

'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Typography, useTheme } from '@mui/material';
import styles from './CalendarPage.module.css';

const CalendarPage: React.FC = () => {
    const theme = useTheme();
    const [value, setValue] = useState(new Date());
    const [view, setView] = useState('month'); // default view is month

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    // Dynamic demo events for the current year and month
    const events = [
        { date: new Date(currentYear, currentMonth, 16), title: 'Meeting with Team' },
        { date: new Date(currentYear, currentMonth, 18), title: 'Project Deadline' },
        { date: new Date(currentYear, currentMonth, 20), title: 'Lunch with Client' },
    ];

    const renderTileContent = ({ date }: { date: Date }) => {
        const event = events.find(
            (event) =>
                event.date.getFullYear() === date.getFullYear() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getDate() === date.getDate()
        );

        return event ? (
            <Box sx={{ backgroundColor: theme.palette.secondary.light, padding: '2px', borderRadius: '4px', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: theme.palette.secondary.contrastText }}>{event.title}</Typography>
            </Box>
        ) : null;
    };

    return (
        <Box sx={{
            width: '100%',
            height: '85vh', // Full height of the viewport minus some space
            borderRadius: '12px',
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.primary.main,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            marginTop: '5px',
            flexDirection: 'column',
            '& .react-calendar__tile': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.text.secondary,
                },
            },
            '& .react-calendar__tile--active': {
                backgroundColor: theme.palette.action.selected,
                color: theme.palette.text.primary,
            },
            '& .react-calendar__tile--now': {
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.text.primary,
            },
            '& .react-calendar__navigation button': {
                color: theme.palette.text.secondary,
            },
            '& .react-calendar__month-view__weekdays__weekday': {
                color: theme.palette.text.secondary,
            },
            '& .react-calendar__month-view__days__day--weekend': {
                color: theme.palette.error.main,
            },
        }}>
            <Calendar
                onChange={(value: any) => setValue(value)}
                value={value}
                tileContent={renderTileContent}
                view={view as any}
                className={styles['react-calendar']}
            />
        </Box>
    );
};

export default CalendarPage;
