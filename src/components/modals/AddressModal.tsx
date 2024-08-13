// src/components/modals/AddressModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Paper, Typography, Box } from '@mui/material';
import { createAddress, updateAddress, getAddressById } from '@/db/address-data';
import { useTheme } from '@mui/material/styles';
import { showErrorToast, showSuccessToast } from '../ui/ButteredToast';
import StyledSearchableSelect, { StyledTextField, StyledSelectField } from '@/styles/StyledTextField';
import { fetchStates } from '@/app/api/geoLoc/fetchStates';
import { fetchCities } from '@/app/api/geoLoc/fetchCities';
import { fetchPostal } from '@/app/api/geoLoc/fetchPostal';

interface AddressModalProps {
    open: boolean;
    handleClose: () => void;
    addressId?: number;
    loadAddresses: () => void;
}

const AddressModal: React.FC<AddressModalProps> = ({ open, handleClose, addressId, loadAddresses }) => {
    const theme = useTheme();
    const [errors, setErrors] = useState({
        name: false,
        country: false,
        address1: false,
        city: false,
        state_province: false,
        postal_code: false,
    });
    const [address, setAddress] = useState<Address>({
        company: '',
        name: '',
        address1: '',
        address2: '',
        city: '',
        state_province: '',
        postal_code: '',
        country: '',
        phone: '',
        email: '',
    });

    // State for options
    const [states, setStates] = useState<{ id: string; display: string }[]>([]);
    const [cities, setCities] = useState<CityType[]>([]);
    const [postalCodes, setPostalCodes] = useState<PostalType[]>([]);

    useEffect(() => {
        if (addressId) {
            const fetchAddress = async () => {
                const data = await getAddressById(addressId);
                if (data.rows.length > 0) {
                    const addressData = data.rows[0] as Address;
                    setAddress(addressData);

                    // Set initial state for dropdowns with default empty string values if undefined
                    setStates([{
                        id: addressData.state_province || '',
                        display: addressData.state_province || ''
                    }]);
                    setCities([{
                        id: addressData.city || '',
                        display: addressData.city || ''
                    }]);
                    setPostalCodes([{
                        id: addressData.postal_code || '',
                        display: addressData.postal_code || ''
                    }]);
                }
            };
            fetchAddress();
        }
    }, [addressId]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCountryChange = async (event: React.ChangeEvent<{ name?: string; value: any }>) => {
        const { name, value } = event.target;
        setAddress(prevState => ({
            ...prevState,
            [name as string]: value as string,
        }));

        if (name === 'country' && value) {
            const fetchedStates = await fetchStates(value);
            if (Array.isArray(fetchedStates)) {
                setStates(fetchedStates);
            } else {
                setStates([]); // or handle the error appropriately
            }
        }
    };

    const handleStateChange = (name: string, value: any) => {
        setAddress((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'state_province' && value) {
            fetchCities(address.country, value).then(setCities);
        }
    };

    const handleCityChange = (name: string, value: any) => {
        setAddress((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === 'city' && value && address.state_province) {
            fetchPostal(address.country, address.state_province, value).then(setPostalCodes);
        }
    };

    const handlePostalChange = (name: string, value: any) => {
        setAddress((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        // Provide default values for any undefined properties
        const addressData = {
            company: address.company || '',
            name: address.name || '',
            address1: address.address1 || '',
            address2: address.address2 || '',
            city: address.city || '',
            state_province: address.state_province || '',
            postal_code: address.postal_code || '',
            country: address.country || '',
            phone: address.phone || '',
            email: address.email || '',
        };

        // Validation logic here...
        const newErrors = {
            name: addressData.name === '',
            country: addressData.country === '',
            address1: addressData.address1 === '',
            city: addressData.city === '',
            state_province: addressData.state_province === '',
            postal_code: addressData.postal_code === '',
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            try {
                if (addressId) {
                    await updateAddress(addressId, addressData);
                    showSuccessToast('Address Updated');
                } else {
                    await createAddress(addressData);
                    showSuccessToast('Address Created');
                }

                loadAddresses();
                handleClose();
            } catch (error) {
                console.error("Error saving address:", error);
                showErrorToast('Address Not Saved');
            }
        }
    };

    // Function to reset the state
    const resetState = () => {
        setAddress({
            company: '',
            name: '',
            address1: '',
            address2: '',
            city: '',
            state_province: '',
            postal_code: '',
            country: '',
            phone: '',
            email: '',
        });
        setStates([]);
        setCities([]);
        setPostalCodes([]);
        setErrors({
            name: false,
            country: false,
            address1: false,
            city: false,
            state_province: false,
            postal_code: false,
        });
    };

    useEffect(() => {
        if (!open) {
            // Reset the state when the modal is closed
            resetState();
        }
    }, [open]);

    interface OptionType {
        value: string;
        label: string;
    }

    interface CityType {
        id: string;
        display: string;
    }

    interface PostalType {
        id: string;
        display: string;
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Paper style={{ margin: 'auto', marginTop: '5%', padding: 20, maxWidth: 400 }}>
                <Typography sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold', color: `${theme.palette.primary.main} !important` }} variant="h6">
                    {addressId ? 'Update Address' : 'Create Address'}
                </Typography>
                <StyledTextField
                    label="Company"
                    name="company"
                    value={address.company}
                    onChange={handleInputChange}
                />
                <StyledTextField
                    label="Phone"
                    name="phone"
                    value={address.phone}
                    onChange={handleInputChange}
                />
                <StyledTextField
                    label="Email"
                    name="email"
                    value={address.email}
                    onChange={handleInputChange}
                />
                <StyledTextField
                    label="Name"
                    name="name"
                    value={address.name}
                    onChange={handleInputChange}
                    required
                    error={errors.name}
                    helperText={errors.name ? 'Name is required' : ''}
                />
                <StyledTextField
                    label="Address 1"
                    name="address1"
                    value={address.address1}
                    onChange={handleInputChange}
                    required
                    error={errors.address1}
                    helperText={errors.address1 ? 'Address is required' : ''}
                />
                <StyledTextField
                    label="Address 2"
                    name="address2"
                    value={address.address2}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <StyledSelectField
                    label="Country"
                    name="country"
                    value={address.country}
                    required
                    error={errors.country}
                    helperText={errors.country ? 'Country is required' : ''}
                    onChange={handleCountryChange}
                    options={[
                        { value: 'US', display: 'US - United States' },
                        { value: 'CA', display: 'CA - Canada' }
                    ]}
                />
                <StyledSearchableSelect
                    options={states.map(state => ({ value: state.id, label: state.display }))}
                    value={states.find(state => state.id === address.state_province)
                        ? { value: address.state_province as string, label: states.find(state => state.id === address.state_province)?.display as string }
                        : null}
                    onChange={(selectedOption) => {
                        const selectedValue = selectedOption ? (selectedOption as OptionType).value : '';
                        setAddress(prevState => ({
                            ...prevState,
                            state_province: selectedValue
                        }));
                        handleStateChange('state_province', selectedValue);
                    }}
                    isSearchable
                    placeholder="Select a State/Province"
                    error={errors.state_province}
                    helperText={errors.state_province ? 'State/Province is required' : ''}
                />

                <StyledSearchableSelect
                    options={cities.map((city: CityType) => ({ value: city.id, label: city.display }))}
                    value={cities.find((city: CityType) => city.id === address.city)
                        ? { value: address.city as string, label: cities.find((city: CityType) => city.id === address.city)?.display as string }
                        : null}
                    onChange={(selectedOption) => {
                        const selectedValue = selectedOption ? (selectedOption as OptionType).value : '';
                        setAddress(prevState => ({
                            ...prevState,
                            city: selectedValue
                        }));
                        handleCityChange('city', selectedValue);
                    }}
                    isSearchable
                    placeholder="Select a City"
                    error={errors.city}
                    helperText={errors.city ? 'City is required' : ''}
                />

                <StyledSearchableSelect
                    options={postalCodes.map((postal: PostalType) => ({ value: postal.id, label: postal.display }))}
                    value={postalCodes.find((postal: PostalType) => postal.id === address.postal_code)
                        ? { value: address.postal_code as string, label: postalCodes.find((postal: PostalType) => postal.id === address.postal_code)?.display as string }
                        : null}
                    onChange={(selectedOption) => {
                        const selectedValue = selectedOption ? (selectedOption as OptionType).value : '';
                        setAddress(prevState => ({
                            ...prevState,
                            postal: selectedValue
                        }));
                        handlePostalChange('postal_code', selectedValue);
                    }}
                    isSearchable
                    placeholder="Select a Postal Code"
                    error={errors.postal_code}
                    helperText={errors.postal_code ? 'Postal Code is required' : ''}
                />

                <Box sx={{ pt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" sx={{ backgroundColor: `${theme.palette.success.main} !important`, color: `${theme.palette.text.primary} !important`, '&:hover': { backgroundColor: `${theme.palette.success.dark} !important` } }} onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="contained" sx={{ backgroundColor: `${theme.palette.warning.main} !important`, color: `${theme.palette.text.primary} !important`, '&:hover': { backgroundColor: `${theme.palette.warning.dark} !important` } }} onClick={handleClose}>
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default AddressModal;
