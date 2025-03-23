// src/components/datagrid/InventoryDataGrid.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { GridColDef } from '@mui/x-data-grid';
import CustomDataGrid from './CustomDataGrid';
import { useInventory } from '@/hooks/inventory/useInventory';

interface SearchParameters {
    warehouse_id?: { value: number; label: string } | null;
    location_id?: { value: number; label: string } | null;
    customer_id?: { value: number; label: string } | null;
    item_number?: { value: number; label: string } | null;
    pallet_tag?: string;
    serial_number?: string;
}

const InventoryDataGrid: React.FC<{ searchParameters?: SearchParameters }> = ({ searchParameters }) => {
    const warehouseID = searchParameters?.warehouse_id?.value ?? undefined;
    const locationID = searchParameters?.location_id?.value ?? undefined;
    const customerID = searchParameters?.customer_id?.value ?? undefined;

    const { inventory, loading, error, refetch } = useInventory({
        warehouseID,
        locationID,
        customerID,
    });

    const columns: GridColDef[] = [
        {
            field: 'avatar',
            headerName: 'Image',
            minWidth: 70,
            flex: 0.2,
            sortable: false,
            renderCell: (params) => (
                params.value ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Image
                            src={params.value}
                            alt="Avatar"
                            width={35}
                            height={35}
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                                width: 35,
                                height: 35
                            }}
                        />
                    </div>
                ) : null
            ),
        },
        { field: 'name', headerName: 'Item', flex: 1, minWidth: 150 },
        { field: 'item_number', headerName: 'Item Number', flex: 1, minWidth: 150 },
        { field: 'customer_name', headerName: 'Customer', flex: 1, minWidth: 150 },
        { field: 'available', headerName: 'Available', flex: 0.5, minWidth: 100 },
        { field: 'receiving', headerName: 'Receiving', flex: 0.5, minWidth: 100 },
        { field: 'received', headerName: 'Received', flex: 0.5, minWidth: 100 },
        { field: 'on_order', headerName: 'On Order', flex: 0.5, minWidth: 100 },
        { field: 'picked', headerName: 'Picked', flex: 0.5, minWidth: 100 },
        { field: 'adjusted', headerName: 'Adjusted', flex: 0.5, minWidth: 100 }
    ];

    return (
        <>
            <CustomDataGrid
                rows={inventory}
                columns={columns}
                fileName="inventory_export"
                columnsToIgnore={['image', 'actions']}
            />
        </>
    );
};

export default InventoryDataGrid;
