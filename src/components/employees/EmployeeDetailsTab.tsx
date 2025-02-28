import React from 'react';
import { Box, Grid, Card, CardContent, IconButton, Avatar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';

const EmployeeDetailsTab = ({ theme, employee, handleEditClick, userCanEdit }: any) => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Customer Details Card */}
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                <CardContent sx={{ position: 'relative' }}>

                    {userCanEdit && (
                        <IconButton
                            onClick={handleEditClick}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            <EditIcon sx={{ color: theme.palette.primary.main }} />
                        </IconButton>
                    )}

                    {/* Avatar Centered */}
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Avatar
                            alt={employee.first_name}
                            src={employee.avatar || ''}
                            sx={{ width: 80, height: 80, backgroundColor: theme.palette.primary.main }}
                        >
                            {!employee.avatarUrl && <PersonIcon sx={{ fontSize: 48, color: theme.palette.text.primary }} />}
                        </Avatar>
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
                                    { label: 'First Name', value: employee.first_name },
                                    { label: 'Last Name', value: employee.last_name },
                                    { label: 'Personal Email', value: employee.personal_email },
                                    { label: 'Company Email', value: employee.email },
                                    { label: 'Department', value: employee.department_name },
                                    { label: 'Role', value: employee.role_display },
                                    { label: 'Start Date', value: employee.start_date },
                                    { label: 'Time Employed', value: employee.time_employed },
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

export default EmployeeDetailsTab;
