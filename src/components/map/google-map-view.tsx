// @/components/map/google-map-view.tsx
"use client";

import React, { useState } from 'react';
import { Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { Property } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Home, Ruler } from 'lucide-react';

interface GoogleMapViewProps {
  properties: Property[];
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

const BatumiCenter = { lat: 41.6464, lng: 41.6327 }; // Approx center of Batumi

export function GoogleMapView({
  properties,
  defaultCenter = BatumiCenter,
  defaultZoom = 13,
}: GoogleMapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="h-full w-full min-h-[calc(100vh-10rem)] rounded-lg overflow-hidden shadow-lg">
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId="binageLiteMap" // Optional: for custom styling in Google Cloud Console
        className="h-full w-full"
      >
        {properties.map((property) => (
          <AdvancedMarker
            key={property.id}
            position={{ lat: property.lat, lng: property.lng }}
            onClick={() => setSelectedProperty(property)}
            title={property.name || property.address}
          >
            <Pin
              background={'hsl(var(--primary))'} // Orange
              borderColor={'hsl(var(--primary-foreground))'} // White
              glyphColor={'hsl(var(--primary-foreground))'} // White
            >
              <span className="text-xs font-bold">${property.price}</span>
            </Pin>
          </AdvancedMarker>
        ))}

        {selectedProperty && (
          <InfoWindow
            position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
            onCloseClick={() => setSelectedProperty(null)}
            pixelOffset={[0,-40]}
          >
            <Card className="w-72 shadow-xl rounded-lg overflow-hidden">
              <CardHeader className="p-0">
                {selectedProperty.photo_urls[0] && (
                  <Image
                    src={selectedProperty.photo_urls[0]}
                    alt={selectedProperty.name || selectedProperty.address}
                    width={300}
                    height={150}
                    className="object-cover w-full h-36"
                    data-ai-hint="apartment interior"
                  />
                )}
                <div className="p-3">
                  <CardTitle className="text-base font-semibold truncate">
                    {selectedProperty.name || selectedProperty.address}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 text-sm space-y-1">
                <div className="flex items-center gap-2 text-primary">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-bold text-lg">{selectedProperty.price} USD</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Home className="h-4 w-4" />
                  <span>{selectedProperty.rooms === 0 ? 'Studio' : `${selectedProperty.rooms} rooms`}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                  <span>{selectedProperty.area} m²</span>
                </div>
              </CardContent>
              <CardFooter className="p-3">
                <Link href={`/property/${selectedProperty.id}`} passHref legacyBehavior>
                  <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <a>View Details</a>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
}
