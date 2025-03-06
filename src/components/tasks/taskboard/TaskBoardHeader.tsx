import { TableHead, TableRow, TableCell, useTheme } from '@mui/material';

export default function TaskBoardHeader({ headers }: { headers: string[] }) {
    const theme = useTheme();

    return (
        <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
            <TableRow>
                {headers.map((title, i) => (
                    <TableCell
                        key={i}
                        sx={{
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                            borderTop: '2px solid #ccc', // Top border
                            borderBottom: '2px solid #ccc', // Bottom border
                            borderRight: i === headers.length - 1 ? 'none' : '1px solid #ccc', // Right border except for last column
                        }}
                    >
                        {title}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
