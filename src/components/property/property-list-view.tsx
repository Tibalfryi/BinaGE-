// @/components/property/property-list-view.tsx
"use client";

import type { Property } from '@/types';
import { PropertyCardItem } from './property-card-item';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertyListViewProps {
  properties: Property[];
}

export function PropertyListView({ properties }: PropertyListViewProps) {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-semibold mb-2">No Properties Found</h2>
        <p className="text-muted-foreground">Try adjusting your filters or searching for a different area.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
        {properties.map((property) => (
          <PropertyCardItem key={property.id} property={property} />
        ))}
      </div>
    </ScrollArea>
  );
}
