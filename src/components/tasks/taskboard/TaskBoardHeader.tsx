import { TableHead, TableRow, TableCell, useTheme } from '@mui/material';

export default function TaskBoardHeader({ headers }: { headers: string[] }) {
    const theme = useTheme();

    return (
        <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
            <TableRow>
                {headers.map((title, i) => (
                    <TableCell
                        key={i}
                        sx={{ fontWeight: 'bold', textTransform: 'capitalize', borderRight: '1px solid #ccc' }}
                    >
                        {title}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
