import React from 'react';
import { Box, Grid, Card, CardContent, IconButton, Avatar, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { formatDate } from '@/functions/common';

const DetailsTab = ({ theme, project, editClick, contactClick, settingsClick }: any) => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Customer Details Card */}
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                <CardContent sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={editClick}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <EditIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>

                    {/* Avatar Centered */}
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Avatar
                            alt={project.name}
                            src={project.logo || ''}
                            sx={{ width: 80, height: 80, backgroundColor: theme.palette.primary.main }}
                        >
                            {!project.logo && <PersonIcon sx={{ fontSize: 48, color: theme.palette.text.primary }} />}
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
                                    { label: 'Name', value: project.name },
                                    { label: 'Start Date', value: formatDate(project.start_date) },
                                    { label: 'End Date', value: formatDate(project.end_date) },
                                    { label: 'Status', value: project.status_name },
                                    { label: 'Scope', value: project.scope },
                                    { label: 'Description', value: project.description },
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

        {/* Contacts Card */}
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                <CardContent sx={{ position: 'relative' }}>
                    <IconButton onClick={contactClick} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <EditIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>Contact</Typography>
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
                                    { label: 'Name', value: project.contact_name || 'N/A' },
                                    { label: 'Phone', value: project.contact_phone || 'N/A' },
                                    { label: 'Email', value: project.contact_email || 'N/A' },
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

        {/* Settings Card */}
        <Grid item xs={12} sm={12} md={4}>
            <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                <CardContent sx={{ position: 'relative' }}>
                    <IconButton onClick={settingsClick} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <EditIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>Settings</Typography>
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
                                    { label: 'Project Manager', value: project.manager_id || 'N/A' },
                                    { label: 'Pallet Prefix', value: project.pallet_prefix || 'N/A' },
                                    { label: 'Warehouses', value: project.warehouses || 'N/A' },
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
