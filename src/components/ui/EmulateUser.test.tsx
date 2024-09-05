// src/components/ui/EmulateUser.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmulateUser from './EmulateUser';
import { useRouter } from 'next/navigation';
import useSession from '@/hooks/useSession';
import { useCheckSession } from '../layout/checksession';

// Mock dependencies
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@/hooks/useSession', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../layout/checksession', () => ({
    useCheckSession: jest.fn(),
}));

const mockRouter = {
    refresh: jest.fn(),
};

const mockUseSession = {
    user: {
        id: '1',
        emulating_user_id: '2',
    },
};

const mockCheckSession = jest.fn();

describe('EmulateUser Component', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useSession as jest.Mock).mockReturnValue(mockUseSession);
        (useCheckSession as jest.Mock).mockReturnValue(mockCheckSession);
    });

    it('renders the button with the correct icon', () => {
        const row = {
            id: '1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            role: 'admin',
            role_display: 'Admin',
            avatar: '',
            active: 'true',
        };

        render(<EmulateUser row={row} loadUsers={jest.fn()} />);

        // Expect the button to render with the PersonIcon initially
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByRole('button').querySelector('svg')).toHaveClass('MuiSvgIcon-root');
    });

    // Additional tests here
});
