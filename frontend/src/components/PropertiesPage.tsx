import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyList from './PropertyList';
import AddPropertyForm from './AddPropertyForm';
import { Building } from 'lucide-react';

interface Property {
  id: string | number;
  name: string;
  address: string;
  price: number;
  description: string;
  images?: string[];
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;
  documents?: string[];
  available_for_visit?: boolean;
}

const PropertiesPage: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = axios.create({ baseURL: 'http://localhost:3000' });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/properties');
      setProperties(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: Omit<Property, 'id'>) => {
    try {
      await api.post('/api/properties', property);
      fetchProperties();
      setError(null);
    } catch (err) {
      setError('Failed to add property');
    }
  };

  const deleteProperty = async (id: string | number) => {
    try {
      await api.delete(`/api/properties/${id}`);
      fetchProperties();
      setError(null);
    } catch (err) {
      setError('Failed to delete property');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 animate-gradient">
      <header className="py-8 text-center fade-in">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
          <Building className="w-8 h-8 md:w-12 md:h-12 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white">Property Manager</h1>
        </div>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300">Manage your properties with ease</p>
      </header>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-end">
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow-md hover:shadow-lg transition-shadow toggle-rotate"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        {error && <div className="text-red-500 text-center fade-in">{error}</div>}
        <AddPropertyForm onAddProperty={addProperty} />
        <PropertyList properties={properties} loading={loading} onDelete={deleteProperty} />
      </div>
    </div>
  );
};

export default PropertiesPage;