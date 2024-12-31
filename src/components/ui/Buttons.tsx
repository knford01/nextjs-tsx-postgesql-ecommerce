import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Button, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { PencilIcon, PlusIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { UserModal, UserStatusModal } from '@/components/modals/UserModals';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function FormButton({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
    >
      {children}
    </button>
  );
}

interface AddUserProps {
  loadUsers: () => void;
}

export const AddUser: React.FC<AddUserProps> = ({ loadUsers }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (data: any) => {
    // console.log('Add User Data:', data);
    loadUsers();
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        startIcon={<PlusIcon className="h-5" />}
        sx={{
          r: 0, backgroundColor: `${theme.palette.secondary.main} !important`, color: `${theme.palette.text.primary} !important`,
          '&:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
        }}
      >
        {isMobile ? 'User' : 'Create User'}
      </Button>
      <UserModal open={open} onClose={handleClose} onSubmit={handleSubmit} />
    </>
  );
}

interface UpdateUserProps {
  id: string;
  row: any;
  loadUsers: () => void;
}

export const UpdateUser: React.FC<UpdateUserProps> = ({ id, row, loadUsers }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = (data: any) => {
    // console.log('Update User Data:', data);
    loadUsers();
    handleClose();
  };

  return (
    <>
      <Tooltip title={'Edit User'} placement="top">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleOpen}
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
          }}
        >
        </Button>
      </Tooltip>
      <UserModal open={open} onClose={handleClose} onSubmit={handleSubmit} id={id} row={row} />
    </>
  );
}

interface UserAccessProps {
  id: string;
}

export const UserAccess: React.FC<UserAccessProps> = ({ id }) => {
  const theme = useTheme();
  const router = useRouter(); // Initialize useRouter

  const handleRedirect = () => {
    router.push(`/navigation/settings/users/${id}`);
  };

  return (
    <>
      <Tooltip title={'User Access'} placement="top">
        <Button
          variant="outlined"
          color="primary"
          onClick={handleRedirect} // Use the handleRedirect function
          startIcon={<LockOutlinedIcon className="w-5" />}
          sx={{
            p: 1, pr: 0, mr: 1,
            backgroundColor: `${theme.palette.error.main} !important`,
            color: `${theme.palette.text.primary} !important`,
            borderColor: `${theme.palette.text.primary} !important`,
            '&:hover': {
              backgroundColor: `${theme.palette.error.dark} !important`,
              color: `${theme.palette.text.secondary} !important`,
            },
          }}
        >
        </Button>
      </Tooltip>
    </>
  );
}

interface UserStatusProps {
  id: string;
  curStatus: number;
  loadUsers: () => void;
}

export const UserStatus: React.FC<UserStatusProps> = ({ id, curStatus, loadUsers }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirm = () => {
    // console.log('User Status Changed:', id);
    loadUsers();
    handleClose();
  };

  return (
    <>
      <Tooltip title={'User Status'} placement="top">
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleOpen}
          startIcon={curStatus === 1 ? <TrashIcon className="w-5" /> : <StarIcon className="w-5" />}
          sx={{
            p: 1,
            pr: 0,
            backgroundColor: `${theme.palette.warning.main} !important`,
            color: `${theme.palette.text.primary} !important`,
            borderColor: `${theme.palette.text.primary} !important`,
            '&:hover': {
              backgroundColor: `${theme.palette.warning.dark} !important`,
              color: `${theme.palette.text.secondary} !important`,
            },
          }}
        >
        </Button>
      </Tooltip>
      <UserStatusModal open={open} onClose={handleClose} onConfirm={handleConfirm} userId={id} curStatus={curStatus} />
    </>
  );
};

