import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Home, MapPin, DollarSign, FileText, Plus, Image, X, Loader, User, Mail, Phone, Calendar } from 'lucide-react';

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

interface AddPropertyFormProps {
  onAddProperty: (property: Omit<Property, 'id'>) => void;
}

const AddPropertyForm: React.FC<AddPropertyFormProps> = ({ onAddProperty }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [owner_name, setOwnerName] = useState('');
  const [owner_email, setOwnerEmail] = useState('');
  const [owner_phone, setOwnerPhone] = useState('');
  const [documents, setDocuments] = useState<string[]>([]);
  const [available_for_visit, setAvailableForVisit] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [submitting, setSubmitting] = useState(false);

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: {[key: string]: string} = {};
    if (!name.trim()) validationErrors.name = 'Name is required.';
    if (!address.trim()) validationErrors.address = 'Address is required.';
    if (price <= 0) validationErrors.price = 'Price must be greater than 0.';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const newProperty: Omit<Property, 'id'> = {
      name: name.trim(),
      address: address.trim(),
      price,
      description: description.trim(),
      images,
      owner_name: owner_name.trim(),
      owner_email: owner_email.trim(),
      owner_phone: owner_phone.trim(),
      documents,
      available_for_visit,
    };
    console.log('Submitting new property with images length:', images.length);
    console.log('Payload size (bytes):', JSON.stringify(newProperty).length);
    try {
      await onAddProperty(newProperty);
      setName('');
      setAddress('');
      setPrice(0);
      setDescription('');
      setImages([]);
      setOwnerName('');
      setOwnerEmail('');
      setOwnerPhone('');
      setDocuments([]);
      setAvailableForVisit(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('Files selected:', files ? files.length : 0);
    if (!files || files.length === 0) return;
    const maxSize = 5 * 1024 * 1024;
    const validFiles: File[] = [];
    const errorMessages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      console.log(`File ${i}: size=${files[i].size}, type=${files[i].type}`);
      if (files[i].size > maxSize) {
        errorMessages.push(`File ${files[i].name} exceeds 5MB`);
      } else {
        validFiles.push(files[i]);
      }
    }
    if (errorMessages.length > 0) {
      setErrors({ images: errorMessages.join('; ') });
    } else {
      setErrors(prev => ({ ...prev, images: '' }));
    }
    if (validFiles.length === 0) return;
    const promises = validFiles.map((file, index) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          console.log(`File ${index} converted to base64`);
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          console.error(`Error reading file ${index}`);
          reject(new Error(`Failed to read file ${index}`));
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(base64Array => {
      setImages(prev => [...prev, ...base64Array]);
      console.log('Images appended, new count:', images.length + base64Array.length);
    }).catch(error => {
      console.error('Error converting images:', error);
      setErrors(prev => ({ ...prev, images: 'Failed to process some images' }));
    });
  };

  return (
    <Card className="shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 slide-in-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Property
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Home className="w-4 h-4 wiggle" />
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="transition-all duration-300 focus:scale-105"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 wiggle" />
              Address
            </Label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="transition-all duration-300 focus:scale-105"
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 wiggle" />
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0"
              required
              className="transition-all duration-300 focus:scale-105"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4 wiggle" />
              Description
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner_name" className="flex items-center gap-2">
              <User className="w-4 h-4 wiggle" />
              Owner Name
            </Label>
            <Input
              id="owner_name"
              type="text"
              value={owner_name}
              onChange={(e) => setOwnerName(e.target.value)}
              className="transition-all duration-300 focus:scale-105"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner_email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 wiggle" />
              Owner Email
            </Label>
            <Input
              id="owner_email"
              type="email"
              value={owner_email}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="transition-all duration-300 focus:scale-105"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner_phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 wiggle" />
              Owner Phone
            </Label>
            <Input
              id="owner_phone"
              type="tel"
              value={owner_phone}
              onChange={(e) => setOwnerPhone(e.target.value)}
              className="transition-all duration-300 focus:scale-105"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4 wiggle" />
              Documents
            </Label>
            <input
              id="documents"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
                  setDocuments(fileUrls);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4 wiggle" />
              Available for Visit
            </Label>
            <div className="flex items-center space-x-2">
              <input
                id="available_for_visit"
                type="checkbox"
                checked={available_for_visit}
                onChange={(e) => setAvailableForVisit(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <Label htmlFor="available_for_visit">Property is available for visits</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="images" className="flex items-center gap-2">
              <Image className="w-4 h-4 wiggle" />
              Images
            </Label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
          </div>
          {images.length > 0 && (
            <div className="space-y-2">
              <Label>Image Previews</Label>
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                onClick={clearAllImages}
                variant="outline"
                className="mt-2"
              >
                Clear All Images
              </Button>
            </div>
          )}
          <Button type="submit" disabled={submitting} className="transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 button-bounce">
            {submitting ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {submitting ? 'Adding...' : 'Add Property'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddPropertyForm;