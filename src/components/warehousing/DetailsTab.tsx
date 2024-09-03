import React from 'react';
import { Box, Grid, Card, CardContent, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const DetailsTab = ({ theme, warehouse, handleEditClick }: any) => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Customer Details Card */}
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                <CardContent sx={{ position: 'relative' }}>
                    <IconButton onClick={handleEditClick} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <EditIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>Details</Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 1,
                            backgroundColor: theme.palette.text.primary,
                            color: theme.palette.primary.main,
                            borderRadius: '8px',
                        }}
                    >
                        {/* Table Layout for Customer Details */}
                        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                            <Box component="tbody">
                                {[
                                    { label: 'Name', value: warehouse.name },
                                    { label: 'Address', value: warehouse.address },
                                    { label: 'City', value: warehouse.city },
                                    { label: 'State', value: warehouse.state },
                                    { label: 'Zip', value: warehouse.zip },
                                    { label: 'Contact', value: warehouse.contact_name },
                                    { label: 'Phone', value: warehouse.contact_phone },
                                ].map((item, index) => (
                                    <Box component="tr" key={index}>
                                        <Box component="td" sx={{ fontWeight: 'bold', fontSize: 14, width: '35%', padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                            {item.label}
                                        </Box>
                                        <Box component="td" sx={{ fontSize: 14, padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                            {item.value}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
);

export default DetailsTab;
