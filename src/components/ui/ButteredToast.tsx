import { toast, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig = {
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    position: "top-right" as ToastPosition, // Cast to ToastPosition
    style: {
        fontSize: '14px',
        padding: '10px',
        maxWidth: '300px',
    },
};

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        ...toastConfig,
        style: {
            ...toastConfig.style,
            backgroundColor: 'green',
            color: 'white',
        },
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        ...toastConfig,
        autoClose: 7000,  // You can override specific properties
        style: {
            ...toastConfig.style,
            backgroundColor: 'red',
            color: 'white',
        },
    });
};
