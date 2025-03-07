import { TableHead, TableRow, TableCell, useTheme } from '@mui/material';

export default function TaskBoardHeader({ headers }: { headers: string[] }) {
    const theme = useTheme();
    const columnWidth = `${100 / headers.length}%`;

    return (
        <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
            <TableRow>
                {headers.map((title, i) => (
                    <TableCell
                        key={i}
                        sx={{
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                            borderTop: '2px solid #ccc',
                            borderBottom: '2px solid #ccc',
                            borderRight: i === headers.length - 1 ? 'none' : '1px solid #ccc',
                            textAlign: 'center',
                            verticalAlign: 'middle',
                            width: columnWidth,
                            minWidth: '120px',
                        }}
                    >
                        {title}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
