import React, { createContext, useState, useContext, useEffect } from 'react';
import { ClinicLocation } from '../types';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface ClinicLocationContextType {
  locations: ClinicLocation[];
  loading: boolean;
  error: string | null;
  selectedLocation: ClinicLocation | null;
  addLocation: (location: Omit<ClinicLocation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLocation: (id: string, updates: Partial<ClinicLocation>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  getLocationById: (id: string) => ClinicLocation | undefined;
  setSelectedLocation: (location: ClinicLocation | null) => void;
  fetchLocations: () => Promise<void>;
  fetchLocationsByCustomer: (customerId: string) => Promise<void>;
}

const ClinicLocationContext = createContext<ClinicLocationContextType>({} as ClinicLocationContextType);

export const useClinicLocations = () => useContext(ClinicLocationContext);

export const ClinicLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<ClinicLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ClinicLocation | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchLocations = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/clinic-locations');
      setLocations(response.data);
    } catch (err: any) {
      console.error('Error fetching clinic locations:', err);
      setError('Failed to fetch clinic locations');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationsByCustomer = async (customerId: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get(`/customers/${customerId}/clinic-locations`);
      setLocations(response.data);
    } catch (err: any) {
      console.error('Error fetching clinic locations:', err);
      setError('Failed to fetch clinic locations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLocations();
    }
  }, [user]);

  const getLocationById = (id: string): ClinicLocation | undefined => {
    return locations.find(location => location.id === id);
  };

  const addLocation = async (location: Omit<ClinicLocation, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/clinic-locations', location);
      setLocations(prev => [...prev, response.data]);
      
      addNotification({
        title: 'New Location Added',
        message: `Location ${response.data.name} has been added`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding clinic location:', err);
      setError('Failed to add clinic location');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (id: string, updates: Partial<ClinicLocation>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/clinic-locations/${id}`, updates);
      setLocations(prev => 
        prev.map(location => 
          location.id === id ? response.data : location
        )
      );
    } catch (err: any) {
      console.error('Error updating clinic location:', err);
      setError('Failed to update clinic location');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!user) return;
    
    const locationToDelete = locations.find(location => location.id === id);
    
    try {
      await apiInstance.delete(`/clinic-locations/${id}`);
      setLocations(prev => prev.filter(location => location.id !== id));
      
      if (locationToDelete) {
        addNotification({
          title: 'Location Deleted',
          message: `Location ${locationToDelete.name} has been removed from the system`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting clinic location:', err);
      setError('Failed to delete clinic location');
      throw err;
    }
  };

  return (
    <ClinicLocationContext.Provider value={{ 
      locations, 
      loading,
      error,
      selectedLocation,
      addLocation, 
      updateLocation, 
      deleteLocation,
      getLocationById,
      setSelectedLocation,
      fetchLocations,
      fetchLocationsByCustomer
    }}>
      {children}
    </ClinicLocationContext.Provider>
  );
};