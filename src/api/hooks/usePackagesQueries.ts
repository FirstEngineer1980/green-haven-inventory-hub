import { useQuery } from '@tanstack/react-query';
import { fetchPackages} from '../services/packageService';
import { PackagesResponse} from '../types/packageTypes';

export const usePackages = () => {
    return useQuery<PackagesResponse, Error>({
        queryKey: ['packages'],
        queryFn: fetchPackages,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
        retry: 1, // Retry once on failure
    });
};