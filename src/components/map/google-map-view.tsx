// @/components/map/google-map-view.tsx
"use client";
import React, { useState } from "react";
import { Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import PropertyDetailsCard from "@/components/property/property-details-card";
import type { Property } from "@/types";
import PropertyDetailsModal from '@/components/ui/PropertyDetailsModal';

interface GoogleMapViewProps {
  properties: Property[];
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

const BatumiCenter = { lat: 41.6464, lng: 41.6327 }; // Approx center of Batumi

const getPinStyle = (price: number): { background: string; glyphColor: string; borderColor: string } => {
  const glyphColor = "hsl(var(--pin-glyph-color))";
  const borderColor = "hsl(var(--pin-border-color))";

  if (price < 500) {
    return { background: "hsl(var(--pin-color-blue))", glyphColor, borderColor };
  } else if (price <= 1000) {
    return { background: "hsl(var(--pin-color-green))", glyphColor, borderColor };
  } else {
    return {
      background: "hsl(var(--primary))",
      glyphColor: "hsl(var(--primary-foreground))",
      borderColor: "hsl(var(--primary-foreground))",
    };
  }
};

export function GoogleMapView({
  properties,
  defaultCenter = BatumiCenter,
  defaultZoom = 13,
}: GoogleMapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const closeModal = () => setSelectedProperty(null);

  return (
    <div className="h-full w-full min-h-[calc(100vh-10rem)] rounded-lg overflow-hidden shadow-lg">
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        gestureHandling="greedy"
        disableDefaultUI={true}
        mapId="binageLiteMap"
        className="h-full w-full"
      >
        {properties.map((property: Property) => {
          const pinStyle = getPinStyle(property.price);
          return (
            <AdvancedMarker
              key={property.id}
              position={{ lat: property.lat, lng: property.lng }}
              onClick={() => handleMarkerClick(property)}
              title={property.name || property.address}
            >
              <Pin
                background={pinStyle.background}
                borderColor={pinStyle.borderColor}
                glyphColor={pinStyle.glyphColor}
              >
                <span className="text-xs font-bold">${property.price}</span>
              </Pin>
            </AdvancedMarker>
          );
        })}
      </Map>

      <PropertyDetailsModal open={!!selectedProperty} onClose={closeModal}>
        {selectedProperty && (
          <PropertyDetailsCard property={selectedProperty} onClose={closeModal} />
        )}
      </PropertyDetailsModal>
    </div>
  );
}