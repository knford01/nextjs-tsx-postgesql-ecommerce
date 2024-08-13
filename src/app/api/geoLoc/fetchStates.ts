// src/app/api/geoLoc/fetchStates.ts

import { GEONAMES_USERNAME } from '@/constants/appConstants';

export const fetchStates = async (countryCode: 'US' | 'CA'): Promise<{ id: string; display: string }[]> => {
    const username = GEONAMES_USERNAME;

    // Map country codes to GeoNames IDs
    const countryGeonameIdMap: { [key: string]: number } = {
        'US': 6252001, // GeoNames ID for United States
        'CA': 6251999  // GeoNames ID for Canada
    };

    const countryGeonameId = countryGeonameIdMap[countryCode];

    if (!countryGeonameId) {
        console.error('Invalid country code provided:', countryCode);
        return [];
    } else {
        // console.log(username);
        // console.log(countryGeonameId);
    }

    const url = `http://api.geonames.org/childrenJSON?geonameId=${countryGeonameId}&username=${username}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.geonames || data.geonames.length === 0) {
            throw new Error('No states found for this country');
        }

        // Map the data to your required format
        return data.geonames.map((state: any) => ({
            // id: state.adminCode1,
            // value: state.adminCodes1.ISO3166_2,
            id: state.adminCodes1.ISO3166_2,
            display: state.name,
        }));
    } catch (error) {
        console.error('Error fetching states:', error);
        return []; // Return an empty array if there was an error
    }
};
