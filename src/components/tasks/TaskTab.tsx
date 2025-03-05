'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import ClearButton from '@/components/ui/buttons/ClearButton';
import { SearchableSelect } from '@/styles/inputs/SearchableSelect';
import { fetchCustomers } from '@/db/customer-data';
import { fetchProjects } from '@/db/project-data';

const TasksDataGrid = dynamic(() => import('@/components/datagrid/TasksDataGrid'), { ssr: false });

interface OptionType {
    value: any;
    label: string;
}

export default function TasksTab() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'tasks', 'tasks')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    // State for customers and projects
    const [customers, setCustomers] = useState<OptionType[]>([]);
    const [projects, setProjects] = useState<OptionType[]>([]);

    // Search parameters state
    const [searchParameters, setSearchParameters] = useState<{ customerId?: number; projectId?: number }>({});

    // Fetch customers and projects when the component loads
    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const customerData = await fetchCustomers();
                const projectData = await fetchProjects();

                setCustomers(customerData.map((c: any) => ({ value: c.id, label: c.name })));
                setProjects(projectData.map((p: any) => ({ value: p.id, label: p.name })));
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };

        loadDropdownData();
    }, []);

    // Handle dropdown changes
    const handleInputChange = (field: 'customerId' | 'projectId', value: OptionType | null) => {
        setSearchParameters((prev) => ({
            ...prev,
            [field]: value?.value ?? undefined, // If null, remove the filter
        }));
    };

    // Clear filters
    const clearSearchParameters = () => {
        setSearchParameters({});
    };

    return (
        <Container
            maxWidth={false}
            sx={{
                m: 0,
                mt: 5,
                width: 'auto',
                height: 'auto',
                transition: 'all 0.3s',
            }}
        >
            <Grid
                container
                spacing={2}
                sx={{
                    mb: 1.5,
                    alignItems: 'center', // Ensures vertical alignment
                    flexWrap: isMobile ? 'nowrap' : 'wrap',
                    overflowX: isMobile ? 'auto' : 'visible',
                    whiteSpace: isMobile ? 'nowrap' : 'normal',
                    gap: isMobile ? 2 : 0,
                    '&::-webkit-scrollbar': { display: 'none' },
                    position: 'relative', // Ensures dropdown can render correctly
                }}
            >
                <Grid item sx={{ flexShrink: 0, mt: 1 }}>
                    <ClearButton onClick={clearSearchParameters} />
                </Grid>

                {/* Customer Select */}
                <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{
                        minWidth: isMobile ? '150px' : 'auto',
                        overflow: 'visible', // Prevents dropdown from being clipped
                    }}
                >
                    <SearchableSelect
                        label="Customer"
                        options={customers}
                        value={customers.find(c => c.value === searchParameters.customerId) || null}
                        onChange={(value) => handleInputChange('customerId', value as OptionType)}
                        placeholder="Select Customer"
                    />
                </Grid>

                {/* Project Select */}
                <Grid
                    item
                    xs={12}
                    sm={2}
                    sx={{
                        minWidth: isMobile ? '150px' : 'auto',
                        overflow: 'visible', // Prevents dropdown from being clipped
                    }}
                >
                    <SearchableSelect
                        label="Project"
                        options={projects}
                        value={projects.find(p => p.value === searchParameters.projectId) || null}
                        onChange={(value) => handleInputChange('projectId', value as OptionType)}
                        placeholder="Select Project"
                    />
                </Grid>
            </Grid>

            <TasksDataGrid searchParameters={searchParameters} />
        </Container>
    );
}
