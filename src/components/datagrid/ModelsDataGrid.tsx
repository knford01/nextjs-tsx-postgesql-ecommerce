import React, { useState, useEffect, useCallback } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { fetchModels } from '@/db/item-data';
import ModelModal from '@/components/modals/inventory/ModelModal';

const ModelsDataGrid: React.FC = () => {
    const theme = useTheme();
    const [models, setModels] = useState<Model[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentModelId, setCurrentModelId] = useState<number | undefined>(undefined);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const loadModels = useCallback(async () => {
        const modelData = await fetchModels();
        setModels(modelData || []);
    }, []);

    useEffect(() => {
        loadModels();
    }, [loadModels]);

    const handleOpenModal = (modelId?: number) => {
        setCurrentModelId(modelId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCurrentModelId(undefined);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'manufacturer_name', headerName: 'Manufacturer', flex: 1, minWidth: 150 },
        { field: 'active', headerName: 'Active', flex: 0.5, minWidth: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            sortable: false,
            minWidth: 250,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenModal(params.row.id)}
                    startIcon={<PencilIcon className="w-5" />}
                    sx={{
                        p: 1, pr: 0, mr: 1,
                        backgroundColor: `${theme.palette.info.main} !important`,
                        color: `${theme.palette.text.primary} !important`,
                        borderColor: `${theme.palette.text.primary} !important`,
                        '&:hover': {
                            backgroundColor: `${theme.palette.info.dark} !important`,
                            color: `${theme.palette.text.secondary} !important`,
                        },
                        [theme.breakpoints.down('sm')]: {
                            minWidth: 'unset',
                            padding: '4px 8px',
                        },
                    }}
                >
                </Button>
            ),
        },
    ];

    return (
        <>
            <CustomDataGrid
                rows={models}
                columns={columns}
                fileName="models_export"
                buttons={
                    <Button
                        startIcon={<PlusIcon className="h-5" />}
                        onClick={() => handleOpenModal()}
                        variant="contained"
                        sx={{
                            r: 0,
                            backgroundColor: `${theme.palette.secondary.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.action.hover} !important`,
                            },
                        }}
                    >
                        {isMobile ? 'Create' : 'Create Model'}
                    </Button>
                }
                columnsToIgnore={['actions']}
            />

            <ModelModal
                open={modalOpen}
                handleClose={handleCloseModal}
                modelId={currentModelId}
                loadModels={loadModels}
            />
        </>
    );
};

export default ModelsDataGrid;
