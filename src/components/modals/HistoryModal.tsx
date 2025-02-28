import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { showErrorToast } from '@/components/ui/ButteredToast';
import { formatName } from '@/functions/common';
import { fetchHistoryRows } from '@/db/history-data';

interface HistoryLog {
    action: string;
    new_value: string;
    change_user: string;
    date_time: string;
}

interface HistoryModalProps {
    open: boolean;
    handleClose: () => void;
    table: string;
    id: number | undefined;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ open, handleClose, table, id }) => {
    const theme = useTheme();
    const [history, setHistory] = useState<HistoryLog[]>([]);
    const [columns, setColumns] = useState<string[]>([]);

    useEffect(() => {
        if (id && table) {
            const loadHistory = async () => {
                try {
                    const fetchedHistory = await fetchHistoryRows(table, id);
                    setHistory(fetchedHistory);

                    const colHeaders = new Set(['action']);
                    fetchedHistory.forEach((log: HistoryLog) => {
                        const newValues = JSON.parse(log.new_value || '{}');
                        Object.keys(newValues).forEach((key) => {
                            if (key !== 'id' && key !== 'date_created') colHeaders.add(key);
                        });
                    });

                    colHeaders.add("change_user");
                    colHeaders.add("date_time");

                    setColumns(Array.from(colHeaders));
                } catch (error) {
                    showErrorToast('Failed to load history.');
                }
            };

            loadHistory();
        }
    }, [id, table]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: '90%', overflowX: 'auto' }}>
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: `${theme.palette.text.primary}`,
                            backgroundColor: theme.palette.background.default,
                            padding: 1,
                            borderRadius: 1,
                        }}
                    >
                        {formatName(table)}
                    </Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col}
                                        sx={{
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize',
                                            color: theme.palette.background.default
                                        }}
                                    >
                                        {formatName(col)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((log: HistoryLog, index: number) => {
                                const newValues = JSON.parse(log.new_value || '{}');
                                const prevValues = index > 0 ? JSON.parse(history[index - 1].new_value || '{}') : {};

                                return (
                                    <TableRow key={index}>
                                        <TableCell sx={{ color: theme.palette.background.default }}>
                                            {index === history.length - 1 ? `${log.action} - Current` : log.action}
                                        </TableCell>

                                        {columns.map((col) => {
                                            if (col === 'action') return null; // Already handled above

                                            if (col === 'change_user') {
                                                return (
                                                    <TableCell key={col} sx={{ color: theme.palette.background.default }}>
                                                        {log.change_user}
                                                    </TableCell>
                                                );
                                            }

                                            if (col === 'date_time') {
                                                return (
                                                    <TableCell key={col} sx={{ color: theme.palette.background.default }}>
                                                        {new Date(log.date_time).toLocaleString()}
                                                    </TableCell>
                                                );
                                            }

                                            const newValue = typeof newValues[col] === 'boolean' ? newValues[col].toString() : newValues[col] ?? "";
                                            const prevValue = typeof prevValues[col] === 'boolean' ? prevValues[col].toString() : prevValues[col] ?? "";

                                            const isChanged = index !== 0 && newValue !== prevValue && !(newValue === "" && prevValue === null);

                                            return (
                                                <TableCell
                                                    key={col}
                                                    sx={{
                                                        backgroundColor: isChanged ? 'yellow' : 'inherit',
                                                        color: theme.palette.background.default
                                                    }}
                                                >
                                                    {Array.isArray(newValue)
                                                        ? newValue.map((item: any, i: number) => <div key={i}>{`${item.key}: ${item.value}`}</div>)
                                                        : newValue || ''}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.warning.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.warning.dark} !important` },
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

export default HistoryModal;
