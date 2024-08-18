'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme, } from '@mui/material';
import { fetchProjectByID } from '@/db/project-data';

const CustomerProfilePage = ({ params }: any) => {
    const theme = useTheme();
    const [projects, setProjects] = useState<any>([]);
    const [activeTab, setActiveTab] = useState<any>(0);

    const { projectId } = params;

    useEffect(() => {
        const loadProjects = async () => {
            const data = await fetchProjectByID(projectId);
            setProjects(data);
        };

        loadProjects();
    }, [projectId]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    if (!projects) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ mt: 2, mx: 4 }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="inventory-tabs" sx={{ '.MuiTab-root': { textTransform: 'none' }, }}>
                <Tab label="Details" />
                <Tab label="Projects" />
                <Tab label="Reports" />
                <Tab label="Logs" />
            </Tabs>

            {activeTab === 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Projects section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 1 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Projects section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 2 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Logs section coming soon...</Typography>
                </Box>
            )}

            {activeTab === 3 && (
                <Box sx={{ mt: 2 }}>
                    <Typography>Logs section coming soon...</Typography>
                </Box>
            )}

        </Box>
    );
};

export default CustomerProfilePage;

