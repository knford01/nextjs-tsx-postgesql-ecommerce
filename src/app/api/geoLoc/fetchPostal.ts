import { GEONAMES_USERNAME } from '@/constants/appConstants';

export const fetchPostal = async (countryCode: string, stateCode: string, cityCode: string) => {
    const username = GEONAMES_USERNAME;
    const url = `http://api.geonames.org/postalCodeSearchJSON?placename=${cityCode}&country=${countryCode}&adminCodes1=${stateCode}&maxRows=10&username=${username}`;

    // console.log(`http://api.geonames.org/postalCodeSearchJSON?placename=${cityCode}&country=${countryCode}&adminCode1=${stateCode}&maxRows=10&username=${username}`);
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.postalCodes || data.postalCodes.length === 0) {
            throw new Error('No postal codes found for this city');
        }

        // Map the data to your required format
        return data.postalCodes
            .map((postal: any) => ({
                id: postal.postalCode,
                display: postal.postalCode,
            }))
            .sort((a: any, b: any) => a.display.localeCompare(b.display));

    } catch (error) {
        console.error('Error postal codes:', error);
        return []; // Return an empty array if there was an error 
    }
};
