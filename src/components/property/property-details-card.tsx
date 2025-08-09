// @/components/property/property-details-card.tsx
import React from 'react';
import Image from 'next/image';
import type { Property } from '@/types'; // Ensure you have this type defined
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, BedDouble, Ruler, Building, Heater, DollarSign, ExternalLink } from 'lucide-react';


interface PropertyDetailsCardProps {
  property: Property;
  onClose: () => void;
}

const AmenityChip = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
    {icon}
    <span>{label}</span>
  </div>
);

const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({ property, onClose }) => {
  if (!property) return null;

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
        <h2 className="text-xl font-bold truncate pr-4" title={property.address}>
          {property.address}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 md:p-6 space-y-6">
          {/* Photo Gallery */}
          {property.photo_urls && property.photo_urls.length > 0 && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md">
              <Image
                src={property.photo_urls[0]}
                alt={`Photo of ${property.address}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                data-ai-hint="apartment interior"
              />
              <Badge variant="secondary" className="absolute top-3 left-3 text-lg font-bold py-2 px-3">
                 <DollarSign className="inline h-5 w-5 mr-1.5" /> {property.price}
              </Badge>
            </div>
          )}

          {/* Key Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
             <AmenityChip icon={<BedDouble className="w-5 h-5 text-primary"/>} label={`${property.rooms} ${property.rooms === 1 ? 'room' : 'rooms'}`} />
             <AmenityChip icon={<Ruler className="w-5 h-5 text-primary"/>} label={`${property.area} m²`} />
             <AmenityChip icon={<Building className="w-5 h-5 text-primary"/>} label={`Floor ${property.floor}`} />
             <AmenityChip icon={<Heater className="w-5 h-5 text-primary"/>} label={property.heating} />
          </div>
          
          {/* Description */}
          {property.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}

          {/* Amenities List */}
          <div>
              <h3 className="text-lg font-semibold mb-2">Amenities</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {property.dishwasher && <li>Dishwasher</li>}
                {property.oven && <li>Oven</li>}
                {property.hasBathtub && <li>Bathtub</li>}
                {property.separateKitchen && <li>Separate Kitchen</li>}
                {property.pets ? <li>Pets allowed</li> : <li>No pets</li>}
              </ul>
          </div>
        </div>
      </ScrollArea>
      
      {/* Footer with CTA */}
      <div className="p-4 border-t mt-auto sticky bottom-0 bg-background">
        <Link href={`/property/${property.id}`} passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" className="block">
            <Button size="lg" className="w-full text-base">
              <ExternalLink className="mr-2 h-5 w-5"/>
              View Full Details
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default PropertyDetailsCard;