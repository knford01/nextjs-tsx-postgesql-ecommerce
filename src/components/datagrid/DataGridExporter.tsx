// src/components/datagrid/DataGridExporter.tsx

'use client';

import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

interface DataGridExporterProps {
    data: any[];
    fileName?: string;
}

const DataGridExporter: React.FC<DataGridExporterProps> = ({ data, fileName = 'export.xlsx' }) => {
    const theme = useTheme();

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

        const buffer = new ArrayBuffer(wbout.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < wbout.length; i++) {
            view[i] = wbout.charCodeAt(i) & 0xff;
        }

        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
    };

    return (
        <Button
            onClick={exportToExcel}
            variant="contained"
            sx={{
                l: 0,
                mr: 1,
                backgroundColor: `${theme.palette.secondary.main} !important`,
                color: theme.palette.text.primary,
                '&:hover': {
                    backgroundColor: `${theme.palette.action.hover} !important`,
                },
            }}
        >
            Export to Excel
        </Button>
    );
};

export default DataGridExporter;  
