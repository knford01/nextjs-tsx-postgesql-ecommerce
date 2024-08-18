//src/app/navigation/calendar/page.tsx
"use client"

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import EventEditModal from '@/components/modals/EventEditModal';
import EventViewModal from '@/components/modals/EventViewModal';
import { deleteEvent, dragAndDropEvent, editCalendarEvent, getCalendarEvents } from '@/db/calendar-data';
import { Box, useTheme } from '@mui/material';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { useRouter } from 'next/navigation';

import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';

const CalendarComponent: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();
    const [events, setEvents] = useState<EventInput[]>([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'calendar')) {
            router.push('/navigation/403'); // Redirect to a 403 error page or any other appropriate route                                                                                            
        } else {
            buildCalendar();
        }
    }, [combinedPermissions, router]);

    const buildCalendar = async () => {
        const data = await getCalendarEvents();

        const calendarEvents: EventInput[] = data.map((event: any) => {
            // console.log('calendarEvent: ', event);

            const startDate = new Date(event.start_date).toISOString().split('T')[0];
            const endDate = new Date(event.end_date).toISOString().split('T')[0];

            const startTime = event.start_time || '00:00:00';
            const endTime = event.end_time || '23:59:59';

            const start = `${startDate}T${startTime}`;
            const end = `${endDate}T${endTime}`;

            return {
                id: event.id,
                title: event.title,
                start,
                end,
                allDay: event.allday,
                color: event.color,
                extendedProps: {
                    description: event.description,
                    event_type: event.event_type,
                    dow: event.dow,
                    color: event.color,
                },
                ...(event.event_type === 'recurring' && {
                    daysOfWeek: event.dow ? event.dow.split(',').map(Number) : undefined,
                    startRecur: startDate,
                    endRecur: endDate,
                    startTime,
                    endTime,
                }),
            };
        });

        setEvents(calendarEvents);
    };

    const handleDragDrop = async (eventDropInfo: any) => {
        const event = eventDropInfo.event;

        const dragEvent = {
            id: event.id,
            event_type: event.extendedProps.event_type,
            start_date: event.startStr,
        };

        try {
            const result = await dragAndDropEvent(dragEvent);

            if (result === 'saved') {
                showSuccessToast('Event updated successfully');
                buildCalendar();
            } else {
                showErrorToast(result);
                buildCalendar();
            }
        } catch (error) {
            showErrorToast('Failed to update event');
            console.error('Drag and drop error:', error);
        }
    };

    const handleDateClick = (selectInfo: DateSelectArg) => {
        setSelectedEvent({
            start: selectInfo.startStr,
        });
        setEditModalOpen(true);
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        const event = clickInfo.event;
        const extendedProps = event.extendedProps || {};

        // console.log('event:', event);

        setSelectedEvent({
            id: event.id,
            title: event.title || '',
            description: extendedProps.description || '',
            start_date: event.startStr,
            end_date: event.endStr,
            event_type: extendedProps.event_type || '',
            color: extendedProps.color || '',
            dow: extendedProps.dow || '',
            allDay: event.allDay
        });

        setViewModalOpen(true);
    };

    const handleEventSave = async (eventData: any) => {
        // console.log(eventData);
        try {
            showSuccessToast('Event Saved');
            editCalendarEvent(eventData);
            setEditModalOpen(false);
            buildCalendar();
        } catch (error) {
            showErrorToast('Failed to Save Event');
        }
    };

    const handleEventDelete = async () => {
        if (!selectedEvent || !selectedEvent.id) return;

        try {
            await deleteEvent(selectedEvent.id);
            showSuccessToast('Event Deleted');
            buildCalendar();
            setViewModalOpen(false);
        } catch (error) {
            showErrorToast('Failed to Delete Event');
        }
    };

    // console.log('event:', events);
    // console.log('selectedEvent:', selectedEvent);

    return (
        <Box sx={{ backgroundColor: theme.palette.background.level1, padding: 1, marginTop: '15px', borderRadius: 5 }}>
            <Box
                sx={{
                    borderRadius: '5px', // Adjust this value for the desired roundness
                    overflow: 'hidden', // Ensure that the rounded corners don't get cut off
                    '& .fc': {
                        borderRadius: '5px', // Apply rounded corners to the calendar itself 
                    },
                    '& .fc-col-header-cell': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.primary,
                    },
                    '& .fc-daygrid-day': {
                        backgroundColor: theme.palette.text.primary,
                        color: theme.palette.primary.main,
                    },
                    '& .fc-daygrid-day-frame': {
                        backgroundColor: theme.palette.text.primary,
                    },
                    '& .fc-daygrid-day-top': {
                        color: theme.palette.text.secondary,
                    },
                    '& .fc-daygrid-event': {
                        backgroundColor: theme.palette.text.primary,
                        color: theme.palette.primary.main,
                    },
                    '& .fc-toolbar-title': {
                        fontWeight: 'bold',
                        color: theme.palette.primary.main,
                    },
                }}
            >
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate={new Date().toISOString().split('T')[0]}  // Set to today's date
                    eventDisplay="block"
                    nextDayThreshold="00:00:00"
                    height={850}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                    }}
                    buttonText={{
                        today: 'Today',
                        year: 'Year',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day',
                        list: 'Month\'s Events'
                    }}
                    dayMaxEventRows={true}
                    views={{
                        dayGrid: {
                            dayMaxEventRows: 6
                        },
                        timeGrid: {
                            dayMaxEventRows: 6
                        }
                    }}
                    editable={true}
                    selectable={true}
                    select={handleDateClick}
                    eventClick={handleEventClick}
                    eventDrop={handleDragDrop} // Apply handleDragDrop here
                    events={events}
                    dayCellContent={(dayCell) => (
                        <Box
                            sx={{
                                backgroundColor: theme.palette.text.primary,
                                color: theme.palette.primary.main,
                                padding: '4px',
                            }}
                        >
                            {dayCell.dayNumberText}
                        </Box>
                    )}
                    dayHeaderContent={(dayHeader) => (
                        <Box
                            sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.text.primary,
                                padding: '5px',
                            }}
                        >
                            {dayHeader.text}
                        </Box>
                    )}
                />

                <EventEditModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSave={handleEventSave}
                    event={selectedEvent}
                    initialDate={selectedEvent?.start?.toString()}
                />

                <EventViewModal
                    open={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    onEdit={() => {
                        setViewModalOpen(false);
                        setEditModalOpen(true);
                    }}
                    onDelete={handleEventDelete}
                    event={selectedEvent}
                />
            </Box>
        </Box>
    );
};

export default CalendarComponent;
