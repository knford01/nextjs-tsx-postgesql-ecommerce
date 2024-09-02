import React from 'react';
import { Box, Grid, Card, CardContent, IconButton, Avatar, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';

const DetailsTab = ({ theme, customer, handleEditClick, contacts, handleAddContact, handleEditContact, emails, handleSendEmail }: any) => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Customer Details Card */}
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                <CardContent sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={handleEditClick}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <EditIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>

                    {/* Avatar Centered */}
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Avatar
                            alt={customer.name}
                            src={customer.avatar || ''}
                            sx={{ width: 80, height: 80, backgroundColor: theme.palette.primary.main }}
                        >
                            {!customer.avatarUrl && <PersonIcon sx={{ fontSize: 48, color: theme.palette.text.primary }} />}
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
                                    { label: 'Name', value: customer.name },
                                    { label: 'Address', value: customer.address },
                                    { label: 'City', value: customer.city },
                                    { label: 'State', value: customer.state },
                                    { label: 'Zip', value: customer.zip },
                                    { label: 'Phone', value: customer.contact_phone },
                                    { label: 'Email', value: customer.contact_email },
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
                    <IconButton onClick={handleAddContact} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <AddIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>Contacts</Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 1,
                            backgroundColor: theme.palette.text.primary,
                            color: theme.palette.primary.main,
                            borderRadius: '8px',
                        }}
                    >

                        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                            <Box component="tbody">
                                {contacts.map((contact: any, index: number) => (
                                    <Box component="tr" key={index} onClick={() => handleEditContact(contact.id)} sx={{ cursor: 'pointer' }}>
                                        <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                            <Typography sx={{ fontSize: 14 }}>{contact.first_name} {contact.last_name}</Typography>
                                        </Box>
                                        <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                            <Typography sx={{ fontSize: 14 }}>{contact.phone_number}</Typography>
                                        </Box>
                                        {contact.main === 1 && (
                                            <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                                <Typography sx={{ fontWeight: 'bold', fontSize: 12, color: theme.palette.success.light }}>Primary Contact</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Grid>

        {/* Send Email Card */}
        <Grid item xs={12} sm={12} md={4}>
            <Card sx={{ backgroundColor: theme.palette.background.level1, color: theme.palette.primary.main }}>
                <CardContent sx={{ position: 'relative' }}>
                    <IconButton onClick={handleSendEmail} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <EmailIcon sx={{ color: theme.palette.primary.main }} />
                    </IconButton>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>Sent Emails</Typography>
                    </Box>

                    <Box
                        sx={{
                            p: 1,
                            backgroundColor: theme.palette.text.primary,
                            color: theme.palette.primary.main,
                            borderRadius: '8px',
                        }}
                    >

                        <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                            <Box component="tbody">
                                {emails.map((email: any, index: number) => (
                                    <Box component="tr" key={index}>
                                        <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                            <Typography sx={{ fontSize: 14 }}>{new Date(email.date_created).toLocaleString()}</Typography>
                                        </Box>
                                        <Box component="td" sx={{ padding: 1, borderBottom: `1px solid ${theme.palette.background.paper}` }}>
                                            <Typography sx={{ fontSize: 14 }}>{email.subject}</Typography>
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
