// @/components/property/property-card-item.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Bath, Home, MapPin, DollarSign, Ruler } from 'lucide-react';

interface PropertyCardItemProps {
  property: Property;
}

export function PropertyCardItem({ property }: PropertyCardItemProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <Link href={`/property/${property.id}`} className="block">
          <Image
            src={property.photo_urls[0] || 'https://placehold.co/600x400.png?text=No+Image'}
            alt={property.name || property.address}
            width={400}
            height={250}
            className="w-full h-48 object-cover"
            data-ai-hint="apartment exterior"
          />
        </Link>
        <Badge variant="default" className="absolute top-2 right-2 bg-primary text-primary-foreground text-sm py-1 px-3">
           ${property.price}
        </Badge>
         {property.is_favorite && (
          <Badge variant="secondary" className="absolute top-2 left-2 bg-accent text-accent-foreground">
            Favorite
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/property/${property.id}`}>
          <CardTitle className="text-lg font-semibold mb-1 truncate hover:text-primary">
            {property.name || property.address}
          </CardTitle>
        </Link>
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2 h-10">
          {property.description}
        </CardDescription>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-primary" />
            <span>{property.rooms === 0 ? 'Studio' : `${property.rooms} rooms`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-primary" />
            <span>{property.area} m²</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{property.address.split(',')[0]}</span>
          </div>
           <div className="flex items-center gap-1.5">
            <Home className="w-4 h-4 text-primary" />
            <span>Floor: {property.floor}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Link href={`/property/${property.id}`} className="w-full" legacyBehavior>
          <Button variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
