'use client';

import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import { SearchableSelect } from '@/styles/SearchableSelect';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { format, addWeeks, startOfWeek, endOfWeek } from 'date-fns';
import { format24HRTime } from '@/functions/common';
import ClearButton from '@/components/ui/buttons/ClearButton';
import ShiftModal from '@/components/modals/employees/ShiftModal';
import { fetchActiveDepartments } from '@/db/employee-settings-data';
import { fetchActiveEmployeesAllDepartment, fetchActiveEmployeesByDepartment } from '@/db/employee-data';
import { fetchShiftByEmployeeIdAndDate } from '@/db/schedule-data';

export default function SchedulingTab() {
    const theme = useTheme();
    const router = useRouter();

    // Existing states
    const [departments, setDepartments] = useState<OptionType[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<OptionType | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [shifts, setShifts] = useState<Record<string, any>>({});
    const [selectedShift, setSelectedShift] = useState<Employee | null>(null);
    const [payWeeks, setPayWeeks] = useState<OptionType[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<OptionType | null>(null);
    const [daysOfWeek, setDaysOfWeek] = useState<{ day: string; date: string }[]>([]);
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const combinedPermissions = useCombinedPermissions();

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'employees', 'scheduling')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const fetchedDepartments = await fetchActiveDepartments();
                const formattedDepartments = [
                    { value: 'all', label: 'All Departments' },
                    ...fetchedDepartments.map((dept: any) => ({
                        value: dept.id.toString(),
                        label: dept.name,
                    })),
                ];
                setDepartments(formattedDepartments);
            } catch (error) {
                showErrorToast('Failed to load departments.');
            }
        };
        loadDepartments();
    }, []);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                if (!selectedDepartment) return;
                let fetchedEmployees: Employee[] = [];
                if (selectedDepartment.value === 'all') {
                    fetchedEmployees = await fetchActiveEmployeesAllDepartment();
                } else {
                    fetchedEmployees = await fetchActiveEmployeesByDepartment(selectedDepartment.value);
                }
                setEmployees(fetchedEmployees);
            } catch (error) {
                showErrorToast('Failed to load employees.');
            }
        };
        loadEmployees();
    }, [selectedDepartment]);

    useEffect(() => {
        const generatedWeeks = Array.from({ length: 12 }, (_, i) => {
            const start = startOfWeek(addWeeks(new Date(), i), { weekStartsOn: 0 });
            const end = endOfWeek(start, { weekStartsOn: 0 });
            return {
                value: format(start, 'yyyy-MM-dd'),
                label: `${format(start, 'M/d/yyyy')} - ${format(end, 'M/d/yyyy')}`,
            };
        });
        setPayWeeks(generatedWeeks);
        setSelectedWeek(generatedWeeks[0]);
    }, []);

    useEffect(() => {
        if (!selectedWeek) return;
        const start = startOfWeek(addWeeks(new Date(selectedWeek.value), 1), { weekStartsOn: 0 });
        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return {
                day: format(date, 'EEE'),
                date: format(date, 'M/d/yyyy'),
            };
        });
        setDaysOfWeek(weekDays);
    }, [selectedWeek]);

    // Fetch shifts for all employees and dates
    useEffect(() => {
        const fetchAllShifts = async () => {
            if (employees.length === 0 || daysOfWeek.length === 0) return;

            const shiftData: Record<string, any> = {};
            for (const emp of employees) {
                for (const { date } of daysOfWeek) {
                    const shift = await fetchShiftByEmployeeIdAndDate(emp.id, date);
                    shiftData[`${emp.id}-${date}`] = shift;
                }
            }
            setShifts(shiftData);
        };
        fetchAllShifts();
    }, [employees, daysOfWeek]);

    const handleClear = () => {
        setSelectedDepartment(null);
        setSelectedWeek(payWeeks[0]);
        setEmployees([]);
        setShifts({});
    };

    const handleOpenShiftModal = (employee: Employee, date: string, shift: any | null) => {
        setSelectedEmployee(employee);
        setSelectedDate(date);
        setSelectedShift(shift);
        setIsShiftModalOpen(true);
    };

    const handleShiftModalSave = async () => {
        setIsShiftModalOpen(false);
    };

    return (
        <Container maxWidth={false} sx={{ m: 0, mt: 5, width: 'auto', height: 'auto', transition: 'all 0.3s' }}>
            <Grid container spacing={2} sx={{ mb: 1.5 }} alignItems="center">
                <Grid item sx={{ mt: 1 }}>
                    <ClearButton onClick={handleClear} />
                </Grid>
                <Grid item sx={{ display: 'flex', gap: 2 }} xs={4}>
                    <SearchableSelect
                        label="Department"
                        options={departments}
                        value={selectedDepartment}
                        onChange={(value) => setSelectedDepartment(value as OptionType)}
                        placeholder="Select Department"
                    />
                    <SearchableSelect
                        label="Pay Week"
                        options={payWeeks}
                        value={selectedWeek}
                        onChange={(value) => setSelectedWeek(value as OptionType)}
                        placeholder="Select Week"
                    />
                </Grid>
            </Grid>

            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.text.primary }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>Employees</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>Role</TableCell>
                            {daysOfWeek.map(({ day, date }, i) => (
                                <TableCell key={i} sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{day} {date}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedDepartment && employees.map((emp, index) => (
                            <TableRow key={index}>
                                <TableCell sx={{ backgroundColor: theme.palette.secondary.main, fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    {emp.first_name} {emp.last_name}
                                </TableCell>
                                <TableCell sx={{ backgroundColor: theme.palette.secondary.main, fontWeight: 'bold', textTransform: 'capitalize' }}>
                                    {emp.role_display}
                                </TableCell>

                                {daysOfWeek.map(({ date }) => {
                                    const shift = shifts[`${emp.id}-${date}`];

                                    return (
                                        <TableCell key={date} sx={{ backgroundColor: theme.palette.secondary.main }}>
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: shift?.color || theme.palette.warning.light, '&:hover': { backgroundColor: theme.palette.warning.dark } }}
                                                onClick={() => handleOpenShiftModal(emp, date, shift)}
                                            >
                                                {shift?.start_time && shift?.end_time
                                                    ? `${format24HRTime(shift.start_time)} - ${format24HRTime(shift.end_time)}`
                                                    : 'Schedule'}
                                            </Button>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ShiftModal
                open={isShiftModalOpen}
                handleClose={() => setIsShiftModalOpen(false)}
                employee={selectedEmployee}
                shift={selectedShift}
                date={selectedDate}
                onSave={handleShiftModalSave}
            />
        </Container>
    );
}

