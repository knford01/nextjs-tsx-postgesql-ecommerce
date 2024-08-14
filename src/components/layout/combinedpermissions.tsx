import React, { createContext, useContext } from 'react';

const CombinedPermissionsContext = createContext<CombinedPermission[] | null>(null);

export const useCombinedPermissions = () => {
    const context = useContext(CombinedPermissionsContext);
    if (!context) {
        throw new Error('useCombinedPermissions must be used within a CombinedPermissionsProvider');
    }
    return context;
};

export const CombinedPermissionsProvider: React.FC<{ combinedPermissions: CombinedPermission[], children: any }> = ({ combinedPermissions, children }) => {
    return (
        <CombinedPermissionsContext.Provider value={combinedPermissions}>
            {children}
        </CombinedPermissionsContext.Provider>
    );
};
