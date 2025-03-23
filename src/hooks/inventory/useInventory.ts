// src/hooks/inventory/useInventory.ts

import { useQuery } from '@apollo/client';
import { GET_FILTERED_INVENTORY } from '@/graphql/inventory/queries';

interface FilterArgs {
    warehouseID?: number;
    locationID?: number;
    customerID?: number;
}

export function useInventory(filters: FilterArgs) {

    const { data, loading, error, refetch } = useQuery(GET_FILTERED_INVENTORY, {
        variables: filters
    });

    return {
        inventory: data?.getFilteredInventory ?? [],
        loading,
        error,
        refetch,
    };
}

