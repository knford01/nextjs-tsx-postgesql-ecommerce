import { Table, TableContainer } from '@mui/material';
import TaskBoardHeader from './TaskBoardHeader';
import TaskBoardBody from './TaskBoardBody';

interface TaskBoardTableProps {
    headers: string[];
    tasksByColumn: Record<string, any[][]>;
    sessionUser: any;
}

export default function TaskBoardTable({ headers, tasksByColumn, sessionUser }: TaskBoardTableProps) {
    return (
        <TableContainer>
            <Table>
                <TaskBoardHeader headers={headers} />
                <TaskBoardBody headers={headers} tasksByColumn={tasksByColumn} sessionUser={sessionUser} />
            </Table>
        </TableContainer>
    );
}
