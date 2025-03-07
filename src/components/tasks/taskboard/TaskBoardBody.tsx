import { TableBody, TableRow, TableCell, useTheme, LinearProgress } from '@mui/material';

interface TaskBoardBodyProps {
    headers: string[];
    tasksByColumn: Record<string, any[][]>;
}

export default function TaskBoardBody({ headers, tasksByColumn }: TaskBoardBodyProps) {
    const theme = useTheme();
    const columnWidth = `${100 / headers.length}%`;

    return (
        <TableBody>
            {Array.from({
                length: Math.max(...Object.values(tasksByColumn).map(arr => arr.length || 0), 1)
            }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {headers.map((header, colIndex) => {
                        const task = tasksByColumn[header]?.[rowIndex] ?? [];
                        console.log("task: ", task);

                        return (
                            <TableCell
                                key={colIndex}
                                sx={{
                                    borderRight: colIndex === headers.length - 1 ? 'none' : '1px solid #ccc',
                                    borderBottom: 'none',
                                    backgroundColor: theme.palette.secondary.main,
                                    color: theme.palette.text.primary,
                                    textAlign: 'center',
                                    verticalAlign: 'middle',
                                    width: columnWidth,
                                    minWidth: '120px',
                                    padding: '10px 10px 0px 10px', // Top, Right, Bottom(0), Left
                                }}
                            >
                                {task.length > 0 &&
                                    task.map(task => {
                                        const bgColor = (theme.palette as any)[task.class.split('.')[0]][task.class.split('.')[1]];

                                        const sumMinutes = task.sum_time
                                            .split(':')
                                            .reduce((acc: number, time: string, index: number) =>
                                                acc + Number(time) * [60, 1, 1 / 60][index], 0
                                            );

                                        const estimatedMinutes = task.estimated_time
                                            .split(':')
                                            .reduce((acc: number, time: string, index: number) =>
                                                acc + Number(time) * [60, 1, 1 / 60][index], 0
                                            );

                                        let progress = estimatedMinutes > 0 ? (sumMinutes / estimatedMinutes) * 100 : 0;
                                        progress = Math.min(progress, 100); // Cap at 100%

                                        let progressColor = theme.palette.success.main; // Default green
                                        if (progress >= 96) progressColor = theme.palette.error.main; // Red
                                        else if (progress >= 81) progressColor = 'orange'; // Orange
                                        else if (progress >= 61) progressColor = theme.palette.warning.main; // Yellow

                                        return (
                                            <div
                                                key={task.id}
                                                style={{
                                                    backgroundColor: bgColor, // Correct theme color resolution
                                                    color: theme.palette.text.primary,
                                                    padding: '8px',
                                                    borderRadius: '4px',
                                                    marginBottom: '5px', // Adds spacing between tasks
                                                }}
                                            >
                                                <span style={{ fontWeight: 'bold' }}>{task.title}</span>
                                                <br />
                                                EST: {task.estimated_time}
                                                <br />
                                                Time: {task.sum_time}
                                                <br />
                                                {/* Progress Bar */}
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={progress}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: theme.palette.grey[300], // Light grey background
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: progressColor, // Dynamic color
                                                        },
                                                    }}
                                                />
                                            </div>
                                        );
                                    })
                                }
                            </TableCell>
                        );
                    })}
                </TableRow>
            ))}
        </TableBody>
    );
}
