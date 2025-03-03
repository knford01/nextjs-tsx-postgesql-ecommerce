'use client';

import React, { useEffect, useState } from 'react';
import { Container, Grid, useTheme, useMediaQuery } from '@mui/material';
import dynamic from 'next/dynamic';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import ClearButton from '@/components/ui/buttons/ClearButton';
import { SearchableSelect } from '@/styles/inputs/SearchableSelect';

const EmployeesDataGrid = dynamic(() => import('@/components/datagrid/EmployeesDataGrid'), { ssr: false });

interface OptionType {
    value: string;
    label: string;
}

const statusOptions: OptionType[] = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
    { value: '', label: 'Both' },
];

export default function EmployeesTab() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const combinedPermissions = useCombinedPermissions();
    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'employees', 'employees')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

    const [searchParameters, setSearchParameters] = useState<{ status: OptionType }>({
        status: statusOptions[0], // Default to 'Active'
    });

    const userCanEdit = hasAccess(combinedPermissions, 'employees', 'edit_employees');

    const handleInputChange = async (field: string, value: OptionType | null) => {
        setSearchParameters((prev) => ({
            ...prev,
            [field]: value as OptionType,
        }));
    };

    const clearSearchParameters = () => {
        setSearchParameters({
            status: statusOptions[0], // Reset to 'Active'
        });
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
            {userCanEdit && (
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
                    <Grid
                        item
                        xs={12}
                        sm={2}
                        sx={{
                            minWidth: isMobile ? '150px' : 'auto',
                            overflow: 'visible' // Prevents dropdown from being clipped 
                        }}
                    >
                        <SearchableSelect
                            label="Status"
                            options={statusOptions}
                            value={searchParameters.status}
                            onChange={(value) => handleInputChange('status', value as OptionType)}
                            placeholder="Select Status"
                        />
                    </Grid>
                </Grid>
            )}
            <EmployeesDataGrid searchParameters={searchParameters} />
        </Container>
    );
}
