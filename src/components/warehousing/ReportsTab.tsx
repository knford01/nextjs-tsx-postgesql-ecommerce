import React from 'react';
import { Card, CardContent, Typography, Link, Box, Grid } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';

const ReportsTab = ({ theme, warehouseId }: any) => {
    return (
        <Box sx={{ mt: 2 }}>
            {/* Reports Card */}
            <Grid item xs={12} sm={12} md={4}>
                <Card sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
                    <CardContent sx={{ position: 'relative' }}>
                        <AssignmentIcon sx={{ position: 'absolute', top: 8, right: 8, marginTop: 1, marginRight: 1 }} />

                        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                            <Typography variant="h6" sx={{ fontSize: 16 }}>Reports</Typography>
                        </Box>
                        <hr style={{ borderColor: theme.palette.warning.main, marginTop: 4, marginBottom: 4 }} />

                        <Box mt={2}>
                            <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2, fontSize: 14 }}>
                                Short Ship
                            </Link>
                            <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2, fontSize: 14 }}>
                                Daily Orders
                            </Link>
                            <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2, fontSize: 14 }}>
                                Daily Receiving
                            </Link>
                            <Link href="#" underline="hover" sx={{ color: theme.palette.text.primary, display: 'block', mb: 2, fontSize: 14 }}>
                                Daily Shipped
                            </Link>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Box>
    )
}

export default ReportsTab;

