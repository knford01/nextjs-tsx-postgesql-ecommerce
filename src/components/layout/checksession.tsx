// src/components/layout/combinedpermissions.tsx

import React, { createContext, useContext } from 'react';

const CheckSessionContext = createContext<() => Promise<void>>(() => Promise.resolve());

export const useCheckSession = () => {
    return useContext(CheckSessionContext);
};

export const CheckSessionProvider: React.FC<{ checkSession: () => Promise<void>, children: any }> = ({ checkSession, children }) => {
    return (
        <CheckSessionContext.Provider value={checkSession}>
            {children}
        </CheckSessionContext.Provider>
    );
};
