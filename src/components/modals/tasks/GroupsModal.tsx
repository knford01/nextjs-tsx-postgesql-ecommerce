import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Button, Paper, Typography, Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { StyledSelectField, StyledTextField } from '@/styles/inputs/StyledTextField';
import { showErrorToast, showSuccessToast } from '@/components/ui/ButteredToast';
import { fetchActiveUsers } from '@/db/user-data';
import { createGroup, updateGroup, fetchGroupById } from '@/db/task-settings-data';

interface GroupsModalProps {
    open: boolean;
    handleClose: () => void;
    groupId?: number; // Optional group ID for editing
    loadGroups: () => void;  // Callback to refresh the list of groups
}

const GroupsModal: React.FC<GroupsModalProps> = ({ open, handleClose, groupId, loadGroups }) => {
    const theme = useTheme();

    const emptyGroupData = useMemo(() => ({
        name: '',
        user_ids: '', // Stored as CSV
        active: true,
    }), []);

    const [groupData, setGroupData] = useState(emptyGroupData);
    const [errors, setErrors] = useState({ name: false });
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Stores selected user IDs

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const userData = await fetchActiveUsers();
                setUsers(userData || []);
            } catch (error) {
                showErrorToast('Failed to load users');
            }
        };
        loadUsers();
    }, []);

    useEffect(() => {
        if (groupId) {
            const loadGroupData = async () => {
                try {
                    const data = await fetchGroupById(groupId);
                    setGroupData(data);
                    setSelectedUsers(data.user_ids ? data.user_ids.split(',') : []);
                } catch (error) {
                    showErrorToast('Failed to load group data');
                }
            };
            loadGroupData();
        } else {
            setGroupData(emptyGroupData);
            setSelectedUsers([]);
        }
    }, [groupId, emptyGroupData]);

    const handleUserSelection = (userId: string) => {
        setSelectedUsers((prevSelected) =>
            prevSelected.includes(userId)
                ? prevSelected.filter((id) => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const handleSubmit = async () => {
        if (groupData.name.trim() === '') {
            setErrors({ name: true });
            return;
        }

        try {
            const userIdsCsv = selectedUsers.join(',');

            const session = await fetch('/api/auth/session').then(res => res.json());

            if (!session.user) {
                throw new Error("User is not authenticated");
            }

            if (groupId) {
                await updateGroup(groupId, groupData.name, userIdsCsv, groupData.active);
                showSuccessToast('Group Updated Successfully');
            } else {
                await createGroup(groupData.name, userIdsCsv, groupData.active, session.user.id);
                showSuccessToast('Group Created Successfully');
            }

            handleClose();
            loadGroups();
        } catch (error) {
            showErrorToast('Failed to save group');
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 400, maxHeight: '80vh', overflowY: 'auto' }}>
                <Typography
                    sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}
                    variant="h6"
                >
                    {groupId ? 'Edit Group' : 'Create Group'}
                </Typography>

                <StyledTextField
                    label="Group Name"
                    name="name"
                    value={groupData.name}
                    onChange={(e: any) => setGroupData({ ...groupData, name: e.target.value })}
                    required
                    error={errors.name}
                    helperText={errors.name ? 'Group name is required' : ''}
                    fullWidth
                    margin="normal"
                />

                <StyledSelectField
                    label="Active"
                    name="active"
                    value={groupData.active.toString()}
                    onChange={(e) => setGroupData({ ...groupData, active: e.target.value === 'true' })}
                    options={[{ value: 'true', display: 'True' }, { value: 'false', display: 'False' }]}
                />

                <Typography sx={{ mt: 2, fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }}>Select Users</Typography>

                <Box sx={{ maxHeight: '250px', overflowY: 'auto', p: 1 }}>
                    <FormGroup>
                        {users.map((user) => (
                            <Box
                                key={user.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    px: 2,
                                    py: 1,
                                    backgroundColor: selectedUsers.includes(user.id.toString()) ? theme.palette.action.selected : 'transparent',
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id.toString())}
                                            onChange={() => handleUserSelection(user.id.toString())}
                                            sx={{ color: theme.palette.primary.main }}
                                        />
                                    }
                                    label={
                                        <Typography sx={{
                                            color: selectedUsers.includes(user.id.toString()) ? theme.palette.text.primary : theme.palette.primary.main,
                                        }}>
                                            {user.user_name}
                                        </Typography>
                                    }
                                />
                            </Box>
                        ))}
                    </FormGroup>
                </Box>

                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.success.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.success.dark} !important` },
                        }}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: `${theme.palette.warning.main} !important`,
                            color: `${theme.palette.text.primary} !important`,
                            '&:hover': { backgroundColor: `${theme.palette.warning.dark} !important` },
                        }}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default GroupsModal;
