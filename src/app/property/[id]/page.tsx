// src/app/property/[id]/page.tsx
"use client"; 

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Property } from '@/types';
import { mockProperties } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BedDouble, Bath, Ruler, MapPin, Heater, Dog, CheckCircle, XCircle, Mail, Phone, Send, DollarSign, Home as HomeIcon, Building } from 'lucide-react';
import { AppHeader } from '@/components/layout/app-header'; // Re-use header for consistent navigation
import { ScrollArea } from '@/components/ui/scroll-area';

// Helper to get amenity icon and text
const AmenityDisplay = ({ label, value, icon }: { label: string; value: boolean | string; icon: React.ReactNode }) => (
  <div className="flex items-center space-x-2 p-2 border rounded-md">
    {icon}
    <span className="text-sm">{label}:</span>
    {typeof value === 'boolean' ? (
      value ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
    ) : (
      <span className="text-sm font-medium capitalize">{value}</span>
    )}
  </div>
);


export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const foundProperty = mockProperties.find(p => p.id === id);
      setProperty(foundProperty || null);
    }
  }, [id]);

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex-grow flex items-center justify-center">
          <p>Property not found or loading...</p>
        </div>
      </div>
    );
  }
  
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % property.photo_urls.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + property.photo_urls.length) % property.photo_urls.length);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <ScrollArea className="flex-grow">
        <div className="container mx-auto py-8 px-4">
          <Button variant="outline" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
          </Button>

          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="p-0">
              {property.photo_urls.length > 0 && (
                <div className="relative">
                  <Image
                    src={property.photo_urls[currentImageIndex]}
                    alt={`${property.name || property.address} - Image ${currentImageIndex + 1}`}
                    width={1200}
                    height={600}
                    className="w-full h-64 md:h-96 object-cover"
                    priority
                    data-ai-hint="apartment photo"
                  />
                  {property.photo_urls.length > 1 && (
                    <>
                      <Button onClick={prevImage} variant="outline" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"> <ArrowLeft/> </Button>
                      <Button onClick={nextImage} variant="outline" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"> <ArrowLeft className="rotate-180"/> </Button>
                    </>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <CardTitle className="text-3xl font-bold text-primary mb-2 sm:mb-0">
                      {property.name || 'Property Details'}
                    </CardTitle>
                    <Badge variant="default" className="text-2xl py-2 px-4 bg-primary text-primary-foreground">
                      <DollarSign className="inline h-6 w-6 mr-1" /> {property.price} USD
                    </Badge>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-5 w-5" />
                    <span>{property.address}</span>
                  </div>

                  <h3 className="text-xl font-semibold mt-6 mb-3">Description</h3>
                  <CardDescription className="text-base leading-relaxed whitespace-pre-line">
                    {property.description}
                  </CardDescription>

                  <h3 className="text-xl font-semibold mt-6 mb-4">Key Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <AmenityDisplay label="Rooms" value={property.rooms === 0 ? 'Studio' : `${property.rooms}`} icon={<BedDouble className="w-5 h-5 text-primary" />} />
                    <AmenityDisplay label="Area" value={`${property.area} m²`} icon={<Ruler className="w-5 h-5 text-primary" />} />
                    <AmenityDisplay label="Floor" value={String(property.floor)} icon={<Building className="w-5 h-5 text-primary" />} />
                    <AmenityDisplay label="Heating" value={property.heating} icon={<Heater className="w-5 h-5 text-primary" />} />
                    <AmenityDisplay label="Balcony" value={property.balcony} icon={<HomeIcon className="w-5 h-5 text-primary" />} />
                    <AmenityDisplay label="Dishwasher" value={property.dishwasher} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12.643 10.055L10.055 12.643M10.055 10.055L12.643 12.643"/><path d="M16.079 6.611L6.611 16.079M6.611 6.611L16.079 16.079"/><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/></svg>} />
                    <AmenityDisplay label="Oven" value={property.oven} icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Zm-2 8H8v4h8Zm-2 8H8v-1.5h8V18Zm0-4.5H8V12h8v1.5Z"/></svg>} />
                    <AmenityDisplay label="Pets Allowed" value={property.pets} icon={<Dog className="w-5 h-5 text-primary" />} />
                  </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                  <Card className="shadow-md">
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Landlord</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {property.owner_contact.email && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href={`mailto:${property.owner_contact.email}`}>
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </a>
                        </Button>
                      )}
                      {property.owner_contact.phone && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href={`tel:${property.owner_contact.phone}`}>
                           <Phone className="mr-2 h-4 w-4" /> Call
                          </a>
                        </Button>
                      )}
                      {property.owner_contact.telegram && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href={`https://t.me/${property.owner_contact.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                            <Send className="mr-2 h-4 w-4" /> Telegram
                          </a>
                        </Button>
                      )}
                       {!property.owner_contact.email && !property.owner_contact.phone && !property.owner_contact.telegram && (
                         <p className="text-sm text-muted-foreground">Contact information not provided.</p>
                       )}
                    </CardContent>
                  </Card>

                  <Button 
                    variant={property.is_favorite ? "default" : "outline"} 
                    className="w-full"
                    onClick={() => alert('Favorite functionality placeholder: This property would be toggled in your favorites.')}
                  >
                    {property.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
