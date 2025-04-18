'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Box, TextField, Grid, Card, Typography, InputAdornment, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { fetchProjects } from '@/db/project-data'; // Updated to fetch all projects
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';

const ProjectsPage = () => {
    const theme = useTheme();
    const router = useRouter();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [searchQuery, setSearchQuery] = useState('');
    const [projects, setProjects] = useState<any[]>([]);

    const loadProjects = useCallback(async () => {
        const projectData = await fetchProjects();
        setProjects(projectData);
        // console.log("projectData: ", projectData);
    }, []);

    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'navigation', 'projects')) {
            router.push('/navigation/403');
        } else {
            loadProjects();
        }
    }, [combinedPermissions, router, loadProjects]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    const filteredProjects = projects?.filter((project) =>
        project.name.toLowerCase().includes(searchQuery)
    );

    return (
        <Box sx={{ mt: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                }}
            >
                <TextField
                    placeholder={isMobile ? 'Search' : 'Search Projects'}
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: isMobile ? '150px' : '300px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon style={{ color: theme.palette.primary.main }} />
                            </InputAdornment>
                        ),
                        style: {
                            color: theme.palette.text.secondary,
                            fontWeight: 'bold',
                            height: '40px',
                        },
                    }}
                />
            </Box>

            <Grid container spacing={2}>
                {filteredProjects?.map((project) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={project.id}>
                        <Link href={`/navigation/customers/projects/${project.id}`} passHref>
                            <Card
                                className="cursor-pointer"
                                sx={{
                                    backgroundColor: project.color,
                                    color: theme.palette.text.primary,
                                    '&:hover': {
                                        backgroundColor: theme.palette.background.level1,
                                        color: theme.palette.primary.main,
                                    },
                                    p: 1,
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', paddingLeft: 1 }}>
                                    {project.name}
                                </Typography>
                                <Box sx={{ backgroundColor: theme.palette.text.primary, borderRadius: 1, p: 1 }}>
                                    <Typography
                                        variant="body2"
                                        color={(theme.palette as any)[project.status_theme.split('.')[0]][project.status_theme.split('.')[1]]}
                                    >
                                        Status: {project.status_name}
                                    </Typography>
                                    <Typography variant="body2" color={theme.palette.primary.main}>
                                        Scope: {project.scope}
                                    </Typography>
                                    <Typography variant="body2" color={theme.palette.primary.main}>
                                        Primary Contact: {project.contact_name} {project.contact_name && project.contact_phone ? '-' : ''}{' '}
                                        {project.contact_phone}
                                    </Typography>
                                </Box>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProjectsPage;
