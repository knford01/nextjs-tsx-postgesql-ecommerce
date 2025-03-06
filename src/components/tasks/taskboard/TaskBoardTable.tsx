import { Table, TableContainer } from '@mui/material';
import TaskBoardHeader from './TaskBoardHeader';
import TaskBoardBody from './TaskBoardBody';

interface TaskBoardTableProps {
    headers: string[];
    tasks?: any[]; // Placeholder for future task data
}

export default function TaskBoardTable({ headers, tasks = [] }: TaskBoardTableProps) {
    return (
        <TableContainer>
            <Table>
                <TaskBoardHeader headers={headers} />
                <TaskBoardBody headers={headers} tasks={tasks} />
            </Table>
        </TableContainer>
    );
}
