import { getAuthHeaders } from './authService';
import { PackagesResponse } from '../types/packageTypes';
import { API_URL } from './config';


export const fetchPackages = async (): Promise<PackagesResponse> => {
    try {
        // Get current language - default to 'ar'
        const lang = 'ar';
        const response = await fetch(`${API_URL}/packages?lang=${lang}`, {
            method: 'GET',
            headers: getAuthHeaders(),
            credentials: 'include',
        });


        if (!response.ok) {
            throw new Error(`Failed to fetch packages: ${response.status}`);
        }

        const data: PackagesResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching packages:', error);
        throw error;
    }
};