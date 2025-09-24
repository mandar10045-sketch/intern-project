import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash } from 'lucide-react';

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

interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  onDelete?: (id: string | number) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, loading = false, onDelete }) => {
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 bg-white dark:bg-gray-800">
            <div className="h-48 bg-gray-300 dark:bg-gray-600 animate-pulse rounded-t-lg"></div>
            <CardHeader>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return <p className="text-center text-gray-500">No properties added yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 fade-in">
      {properties.map((property, index) => {
        console.log(`Displaying property ${property.id} with images:`, property.images ? property.images.length : 0);
        return (
          <Card key={property.id} className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-blue-500 bg-white dark:bg-gray-800 bounce-in" style={{ animationDelay: `${index * 0.1}s` }}>
            {property.images && property.images.length > 0 && (
              <div>
                <img src={property.images[0]} alt={property.name} className="h-48 w-full object-cover rounded-t-lg" onError={(_e) => console.error(`Error loading main image for property ${property.id}`)} />
                {property.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 p-2">
                    {property.images.slice(1).map((img, index) => (
                      <img key={index} src={img} alt={`${property.name} ${index + 2}`} className="h-20 w-full object-cover rounded" onError={(_e) => console.error(`Error loading additional image ${index + 1} for property ${property.id}`)} />
                    ))}
                  </div>
                )}
              </div>
            )}
            <CardHeader className="relative">
              <CardTitle>{property.name}</CardTitle>
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                ₹{property.price.toLocaleString()}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{property.address}</p>
              <p className="text-sm mb-4">{property.description}</p>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 button-bounce"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 button-bounce"
                  onClick={() => onDelete && onDelete(property.id)}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PropertyList;