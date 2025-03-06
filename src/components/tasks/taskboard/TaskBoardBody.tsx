import { TableBody, TableRow, TableCell, useTheme } from '@mui/material';

interface TaskBoardBodyProps {
    headers: string[];
    tasksByColumn: Record<string, any[][]>;
}

export default function TaskBoardBody({ headers, tasksByColumn }: TaskBoardBodyProps) {
    const theme = useTheme();

    return (
        <TableBody>
            {Array.from({
                length: Math.max(...Object.values(tasksByColumn).map(arr => arr.length || 0), 1)
            }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {headers.map((header, colIndex) => {
                        const tasks = tasksByColumn[header]?.[rowIndex] ?? [];

                        return (
                            <TableCell
                                key={colIndex}
                                sx={{
                                    borderRight: colIndex === headers.length - 1 ? 'none' : '1px solid #ccc', // Only right border
                                    borderBottom: 'none',
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.text.primary
                                }}
                            >
                                {tasks.length > 0 &&
                                    tasks.map(task => (
                                        <div key={task.id}>{task.title}</div>
                                    ))
                                }
                            </TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </TableBody>
    );
}
