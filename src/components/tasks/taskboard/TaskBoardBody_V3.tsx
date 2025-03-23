import { useState, useEffect } from 'react';
import { TableBody, TableRow, TableCell, useTheme, LinearProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Task {
    id: string;
    title: string;
    scope: string;
    class: string;
    estimated_time: string;
    sum_time: string;
}

interface TaskBoardBodyProps {
    headers: string[];
    tasksByColumn: Record<string, Task[][]>; // Multi-dimensional array
    sessionUser: any;
}

export default function TaskBoardBody({ headers, tasksByColumn, sessionUser }: TaskBoardBodyProps) {
    const theme = useTheme();
    const router = useRouter();
    const columnWidth = `${100 / headers.length}%`;

    // Ensure state is properly initialized and updated when props change
    const [columns, setColumns] = useState<Record<string, Task[][]>>({});

    useEffect(() => {
        if (Object.keys(tasksByColumn).length > 0) {
            setColumns(tasksByColumn);
        }
    }, [tasksByColumn]); // Sync when prop changes

    console.log('Columns State:', columns); // Debugging to see if it updates properly

    // Handle drag-and-drop updates
    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // If dropped outside a valid destination, do nothing
        if (!destination) return;

        const sourceColumnId = source.droppableId;
        const destColumnId = destination.droppableId;
        const sourceRow = source.index;
        const destRow = destination.index;

        // Clone the current state
        const newColumns = { ...columns };

        // Ensure source and destination columns exist
        if (!newColumns[sourceColumnId]) newColumns[sourceColumnId] = [];
        if (!newColumns[destColumnId]) newColumns[destColumnId] = [];

        const sourceColumn = [...newColumns[sourceColumnId]];
        const destColumn = [...newColumns[destColumnId]];

        // Ensure the source row exists and contains a task
        if (!sourceColumn[sourceRow] || sourceColumn[sourceRow].length === 0) return;

        // Move the task
        const movedTask = sourceColumn[sourceRow][0];
        sourceColumn.splice(sourceRow, 1); // Remove from source row

        // Ensure the destination row exists
        while (destColumn.length <= destRow) {
            destColumn.push([]); // Fill missing rows with empty arrays
        }

        // Insert the task at the destination and shift existing tasks down
        destColumn.splice(destRow, 0, [movedTask]);

        // Update state
        setColumns({
            ...newColumns,
            [sourceColumnId]: sourceColumn,
            [destColumnId]: destColumn,
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <TableBody>
                {Array.from({
                    length: Math.max(...Object.values(columns).map(arr => arr.length || 0), 1),
                }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {headers.map((header, colIndex) => {
                            // Ensure each column exists, defaulting to an array of empty arrays
                            const tasks = columns[header] ?? [];

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
                                        padding: '10px 10px 0px 10px',
                                    }}
                                >
                                    <Droppable droppableId={header}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: '50px' }}>
                                                {tasks[rowIndex] && tasks[rowIndex].length > 0 ? (
                                                    tasks[rowIndex].map((task, index) => {
                                                        // Ensure `task` is actually an object
                                                        if (!task || !task.id) return null;

                                                        console.log('Rendering Task:', task);

                                                        const bgColor = (theme.palette as any)[task.class.split('.')[0]][task.class.split('.')[1]];

                                                        const sumMinutes = task.sum_time
                                                            .split(':')
                                                            .reduce((acc: number, time: string, i: number) =>
                                                                acc + Number(time) * [60, 1, 1 / 60][i], 0
                                                            );

                                                        const estimatedMinutes = task.estimated_time
                                                            .split(':')
                                                            .reduce((acc: number, time: string, i: number) =>
                                                                acc + Number(time) * [60, 1, 1 / 60][i], 0
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
                                                    })
                                                ) : (
                                                    // Show empty drop area if there are no tasks in the column
                                                    <div style={{ padding: '10px', minHeight: '50px', textAlign: 'center', color: '#aaa' }}>
                                                        Drop Task Here
                                                    </div>
                                                )}
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
        </DragDropContext>
    );
}
