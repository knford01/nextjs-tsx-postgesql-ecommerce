// src/components/datagrid/CustomDataGrid.tsx

'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridCellParams, GridRowSelectionModel } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material';
import DataGridExporter from './DataGridExporter';

interface CustomDataGridProps {
    rows: any[];
    columns: GridColDef[];
    fileName: string;
    buttons?: React.ReactNode;
    columnsToIgnore?: string[];
}

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
    rows,
    columns = [],
    fileName,
    buttons,
    columnsToIgnore = [],
}) => {
    const [tooltipInfo, setTooltipInfo] = useState<{ rowId: string | number, field: string } | null>(null);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const theme = useTheme();

    const handleCellClick = (params: GridCellParams) => {
        if (params.field !== 'avatar' && params.value) {
            copyToClipboard(params.value.toString());
            setTooltipInfo({ rowId: params.id, field: params.field });
            setTimeout(() => setTooltipInfo(null), 2000); // Hide the tooltip after 2 seconds
        }
    };

    const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
        const selected = rows.filter(row => newSelection.includes(row.id));
        setSelectedRows(selected);
    };

    const renderCell = (params: GridCellParams) => {
        const isTooltipVisible = !!(tooltipInfo && tooltipInfo.rowId === params.id && tooltipInfo.field === params.field);
        return (
            <Tooltip
                title="Copied!"
                open={isTooltipVisible}
                disableHoverListener
                disableFocusListener
                disableTouchListener
                placement="right"
            >
                <div>{params.value as React.ReactNode}</div>
            </Tooltip>
        );
    };

    const visibleColumns = columns.map(col => col.field);
    const filteredSelectedRows = selectedRows.map(row => {
        const filteredRow: { [key: string]: any } = {};
        visibleColumns.forEach(col => {
            if (!columnsToIgnore.includes(col)) {
                filteredRow[col] = row[col as keyof typeof row];
            }
        });
        return filteredRow;
    });

    return (
        <Box sx={{ borderRadius: 2, width: '100%', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                <DataGridExporter data={filteredSelectedRows} fileName={`${fileName}.xlsx`} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {buttons}
                </Box>
            </Box>
            <DataGrid
                rows={rows}
                columns={columns.map(col => ({
                    ...col,
                    renderCell: col.field !== 'avatar' && col.field !== 'actions' ? renderCell : col.renderCell,
                }))}
                checkboxSelection
                disableRowSelectionOnClick
                onCellClick={handleCellClick}
                onRowSelectionModelChange={handleSelectionChange}
            />
        </Box>

    );
};

export default CustomDataGrid;
