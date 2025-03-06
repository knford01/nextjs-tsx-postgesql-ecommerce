import { Table, TableContainer } from '@mui/material';
import TaskBoardHeader from './TaskBoardHeader';
import TaskBoardBody from './TaskBoardBody';

interface TaskBoardTableProps {
    headers: string[];
    tasksByColumn: Record<string, any[][]>;
}

export default function TaskBoardTable({ headers, tasksByColumn }: TaskBoardTableProps) {
    return (
        <TableContainer>
            <Table>
                <TaskBoardHeader headers={headers} />
                <TaskBoardBody headers={headers} tasksByColumn={tasksByColumn} />
            </Table>
        </TableContainer>
    );
}
