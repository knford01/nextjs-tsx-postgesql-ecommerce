//src/app/navigation/projects/[projectId]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { fetchProjectByID } from '@/db/project-data';
import ProjectModal from '@/components/modals/ProjectModal';
import ProjectContactModal from '@/components/modals/ProjectContactModal';
import DetailsTab from '@/components/projects/DetailsTab';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import ProjectSettingsModal from '@/components/modals/ProjectSettingsModal';

const ProjectProfilePage = ({ params }: any) => {
    const theme = useTheme();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<any>(0);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isProjectContactModalOpen, setIsProjectContactModalOpen] = useState(false);
    const [isProjectSettingsModalOpen, setIsProjectSettingsModalOpen] = useState(false);
    const { projectId } = params;

    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        const loadProject = async () => {
            const projectData = await fetchProjectByID(projectId);
            setProject(projectData);
            console.log("projectData: ", projectData);
        };

        if (!hasAccess(combinedPermissions, 'customers', 'projects')) {
            router.push('/navigation/403');
        } else {
            loadProject();
        }

    }, [projectId, combinedPermissions, router]);

    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

    const handleProjectModalSave = async () => {
        const updatedProject = await fetchProjectByID(projectId);
        setProject(updatedProject);
        setIsProjectModalOpen(false);
        setIsProjectContactModalOpen(false);
        setIsProjectSettingsModalOpen(false);
    };

    const tabsConfig = [
        { label: 'Details', permission: 'project_details' },
        { label: 'Reports', permission: 'project_reports' },
        { label: 'Logs', permission: 'project_logs' },
    ];

    const accessibleTabs = tabsConfig.filter(tab => hasAccess(combinedPermissions, 'customers', tab.permission));

    if (!project) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="project-profile-tabs"
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    '.MuiTab-root': { textTransform: 'none', minWidth: 'auto' },
                    overflowX: 'auto',
                }}
            >
                {accessibleTabs.map((tab) => (
                    <Tab key={tab.label} label={tab.label} />
                ))}
            </Tabs>

            {activeTab === 0 && (
                <DetailsTab
                    theme={theme}
                    project={project}
                    editClick={() => setIsProjectModalOpen(true)}
                    contactClick={() => setIsProjectContactModalOpen(true)}
                    settingsClick={() => setIsProjectSettingsModalOpen(true)}
                />
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

            <ProjectModal
                open={isProjectModalOpen}
                handleClose={() => setIsProjectModalOpen(false)}
                projectId={project.id}
                customerId={project.customer_id}
                onSave={handleProjectModalSave}
            />

            <ProjectContactModal
                open={isProjectContactModalOpen}
                handleClose={() => setIsProjectContactModalOpen(false)}
                project={project}
                onSave={handleProjectModalSave}
            />

            <ProjectSettingsModal
                open={isProjectSettingsModalOpen}
                handleClose={() => setIsProjectSettingsModalOpen(false)}
                project={project}
                onSave={handleProjectModalSave}
            />
        </Box>
    );
};

export default ProjectProfilePage;
