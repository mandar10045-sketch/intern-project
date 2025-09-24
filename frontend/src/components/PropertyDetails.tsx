import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, FileText, Calendar, Building } from 'lucide-react';

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

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({ baseURL: 'http://localhost:3000' });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/properties/${id}`);
        setProperty(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'Property not found'}</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/')} className="mb-6" variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Properties
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Property Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-6 h-6" />
                  {property.name}
                </CardTitle>
                <div className="text-2xl font-bold text-green-600">
                  ₹{property.price.toLocaleString()}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{property.address}</p>
                <p className="text-sm">{property.description}</p>
              </CardContent>
            </Card>

            {/* Images */}
            {property.images && property.images.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Property Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${property.name} ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => console.error(`Error loading image ${index + 1}`)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Owner Details */}
            {(property.owner_name || property.owner_email || property.owner_phone) && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Owner Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {property.owner_name && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Name:</span>
                      <span>{property.owner_name}</span>
                    </div>
                  )}
                  {property.owner_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${property.owner_email}`} className="text-blue-600 hover:underline">
                        {property.owner_email}
                      </a>
                    </div>
                  )}
                  {property.owner_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${property.owner_phone}`} className="text-blue-600 hover:underline">
                        {property.owner_phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            {property.documents && property.documents.length > 0 && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {property.documents.map((doc, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Document {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Schedule Visit */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Visit
                </CardTitle>
              </CardHeader>
              <CardContent>
                {property.available_for_visit ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      This property is available for visits. Contact the owner to schedule a viewing.
                    </p>
                    <Button className="w-full" onClick={() => {
                      if (property.owner_email) {
                        window.location.href = `mailto:${property.owner_email}?subject=Property Visit Request - ${property.name}`;
                      } else if (property.owner_phone) {
                        window.location.href = `tel:${property.owner_phone}`;
                      }
                    }}>
                      Contact Owner
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This property is currently not available for visits.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;