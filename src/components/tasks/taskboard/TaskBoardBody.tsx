import { TableBody, TableRow, TableCell, useTheme } from '@mui/material';

interface TaskBoardBodyProps {
    headers: string[]; // Headers define the columns, tasks will be mapped to them later
    tasks?: any[]; // Placeholder for task data to be added later
}

export default function TaskBoardBody({ headers, tasks = [] }: TaskBoardBodyProps) {
    const theme = useTheme();

    return (
        <TableBody>
            {/* Placeholder row for now, will be replaced with dynamic task rows later */}
            <TableRow>
                {headers.map((_, index) => (
                    <TableCell key={index} sx={{ borderRight: '1px solid #ccc', backgroundColor: theme.palette.secondary.main }}>
                        {/* Placeholder text, to be replaced with actual task data */}
                        {tasks.length > 0 ? 'Task Data' : 'No Data'}
                    </TableCell>
                ))}
            </TableRow>
        </TableBody>
    );
}
