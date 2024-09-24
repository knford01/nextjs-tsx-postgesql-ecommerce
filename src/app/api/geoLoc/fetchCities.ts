import { GEONAMES_USERNAME } from '@/constants/appConstants';

export const fetchCities = async (countryCode: string, stateCode: string) => {
    const username = GEONAMES_USERNAME;
    const url = `http://api.geonames.org/searchJSON?country=${countryCode}&adminCodes1=${stateCode}&featureClass=P&username=${username}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.geonames || data.geonames.length === 0) {
            throw new Error('No cities found for this state');
        }

        // Map the data to your required format
        return data.geonames
            .map((city: any) => ({
                id: city.name,
                display: city.name,
            }))
            .sort((a: any, b: any) => a.display.localeCompare(b.display));
    } catch (error) {
        console.error('Error cities:', error);
        return []; // Return an empty array if there was an error
    }
};
