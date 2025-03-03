'use client';

import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import { useCombinedPermissions } from '@/components/layout/combinedpermissions';
import { hasAccess } from '@/utils/permissions2';
import { useRouter } from 'next/navigation';
import { StyledSearchableSelect } from '@/styles/inputs/StyledTextField';
import ClearButton from '@/components/ui/buttons/ClearButton';

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
    const theme = useTheme();
    const router = useRouter();
    const combinedPermissions = useCombinedPermissions();

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

    useEffect(() => {
        if (!hasAccess(combinedPermissions, 'employees', 'employees')) {
            router.push('/navigation/403');
        }
    }, [combinedPermissions, router]);

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
                <Grid container spacing={2} sx={{ mb: 1.5 }} alignItems="center">
                    <Grid item sx={{ mt: 1 }}>
                        <ClearButton onClick={clearSearchParameters} />
                    </Grid>
                    <Grid item xs={2}>
                        <StyledSearchableSelect
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
