// app/ui/components/modals/users/UserStatusModal.tsx

import React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { setUserStatus } from '@/db/user-data';
import { showSuccessToast } from '../../ui/ButteredToast';

interface UserStatusModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userId: string;
    curStatus: number;
}

export const UserStatusModal: React.FC<UserStatusModalProps> = ({ open, onClose, onConfirm, userId, curStatus }) => {
    const theme = useTheme();

    const handleConfirm = async () => {
        await setUserStatus(userId, curStatus === 1 ? 0 : 1);
        showSuccessToast('User Status Updated');
        onConfirm();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 4, backgroundColor: `${theme.palette.background.paper} !important`, margin: 'auto', mt: '20vh', width: 400, borderRadius: 2 }}>
                <Typography sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }} variant="h6">
                    {curStatus === 1 ? 'Confirm Deactivation' : 'Confirm Activation'}
                </Typography>
                <Typography sx={{ mb: 2, textAlign: 'center', color: `${theme.palette.primary.main} !important` }}>
                    {curStatus === 1 ? 'Are you sure you want to deactivate this user?' : 'Are you sure you want to activate this user?'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.success.main} !important`, color: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.success.dark} !important`,
                            },
                        }} onClick={handleConfirm}>Yes</Button>
                    <Button variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.warning.main} !important`, color: `${theme.palette.text.primary} !important`,
                            '&:hover': {
                                backgroundColor: `${theme.palette.warning.dark} !important`,
                            },
                        }} onClick={onClose}>No</Button>
                </Box>
            </Box>
        </Modal>
    );
};
