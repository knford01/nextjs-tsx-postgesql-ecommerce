import { TableBody, TableRow, TableCell, useTheme, LinearProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface TaskBoardBodyProps {
    headers: string[];
    tasksByColumn: Record<string, any[][]>;
    sessionUser: any;
}

export default function TaskBoardBody({ headers, tasksByColumn, sessionUser }: TaskBoardBodyProps) {
    const theme = useTheme();
    const router = useRouter();
    const columnWidth = `${100 / headers.length}%`;

    return (
        <DragDropContext onDragEnd={() => { }}>
            <TableBody>
                {Array.from({
                    length: Math.max(...Object.values(tasksByColumn).map(arr => arr.length || 0), 1)
                }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {headers.map((header, colIndex) => {
                            const tasks = tasksByColumn[header]?.[rowIndex] ?? [];

                            return (
                                <TableCell
                                    key={colIndex} // Move key here
                                    sx={{
                                        borderRight: colIndex === headers.length - 1 ? 'none' : '1px solid #ccc',
                                        borderBottom: 'none',
                                        backgroundColor: theme.palette.secondary.main,
                                        color: theme.palette.text.primary,
                                        textAlign: 'center',
                                        verticalAlign: 'middle',
                                        width: columnWidth,
                                        minWidth: '120px',
                                        padding: '10px 10px 0px 10px',
                                    }}
                                >
                                    <Droppable droppableId={header}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                {tasks.map((task, index) => {
                                                    console.log('Rendering Task:', task);

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
                                                    progress = Math.min(progress, 100);

                                                    let progressColor = theme.palette.success.main;
                                                    if (progress >= 96) progressColor = theme.palette.error.main;
                                                    else if (progress >= 81) progressColor = 'orange';
                                                    else if (progress >= 61) progressColor = theme.palette.warning.main;

                                                    return (
                                                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onClick={() => router.push(`/navigation/tasks/${task.id}`)}
                                                                    style={{
                                                                        backgroundColor: bgColor,
                                                                        color: theme.palette.text.primary,
                                                                        padding: '8px',
                                                                        borderRadius: '4px',
                                                                        marginBottom: '5px',
                                                                        cursor: 'pointer',
                                                                        transition: 'background-color 0.2s ease-in-out',
                                                                        ...provided.draggableProps.style,
                                                                    }}
                                                                >
                                                                    <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                                                        {task.title}
                                                                    </span>
                                                                    <div style={{ marginTop: '2px', fontSize: '0.9rem' }}>{task.scope}</div>
                                                                    <div
                                                                        style={{
                                                                            border: '1px solid #ccc',
                                                                            padding: '2px 5px',
                                                                            borderRadius: '4px',
                                                                            fontSize: '0.8rem',
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            alignItems: 'center',
                                                                            marginTop: '4px',
                                                                        }}
                                                                    >
                                                                        <span>EST: {task.estimated_time}</span>
                                                                        <span>Time: {task.sum_time}</span>
                                                                    </div>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={progress}
                                                                        sx={{
                                                                            height: 8,
                                                                            borderRadius: 4,
                                                                            backgroundColor: theme.palette.grey[300],
                                                                            marginTop: '4px',
                                                                            '& .MuiLinearProgress-bar': {
                                                                                backgroundColor: progressColor,
                                                                            },
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                })}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </TableCell>
                            );
                        })}
                    </TableRow>

                ))}
            </TableBody>
        </DragDropContext >
    );
}
