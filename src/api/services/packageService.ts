import { getAuthHeaders } from './authService';
import { PackagesResponse } from '../types/packageTypes';
import { API_URL } from './config';
import i18n from 'i18next';


export const fetchPackages = async (): Promise<PackagesResponse> => {
    try {
        // Get current language from i18next
        const lang = i18n.language || 'ar'; // Default to 'ar' if not set
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