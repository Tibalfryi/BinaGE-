// src/app/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { FilterSidebar } from '@/components/layout/filter-sidebar';
import { GoogleMapView } from '@/components/map/google-map-view';
import { PropertyListView } from '@/components/property/property-list-view';
import { Button } from '@/components/ui/button';
import { MapIcon, ListIcon, Loader2 } from 'lucide-react';
import type { Property, PropertyFilters } from '@/types';
import { mockProperties } from '@/data/mock-data';
import { SidebarInset } from '@/components/ui/sidebar';

type ViewMode = 'map' | 'list';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({
    priceMin: 0,
    priceMax: 5000,
    roomsMin: 0,
    areaMin: 0,
    areaMax: 300,
    heating: [],
    balcony: false,
    dishwasher: false,
    oven: false,
    pets: false,
  });
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching properties
  useEffect(() => {
    setIsLoading(true);
    // In a real app, fetch properties from an API
    setProperties(mockProperties);
    setFilteredProperties(mockProperties); // Initially show all
    setIsLoading(false);
  }, []);

  const applyFilters = useCallback((allProps: Property[], currentFilters: PropertyFilters): Property[] => {
    return allProps.filter(prop => {
      if (currentFilters.priceMin !== undefined && prop.price < currentFilters.priceMin) return false;
      if (currentFilters.priceMax !== undefined && prop.price > currentFilters.priceMax) return false;
      if (currentFilters.roomsMin !== undefined && prop.rooms < currentFilters.roomsMin) return false;
      if (currentFilters.areaMin !== undefined && prop.area < currentFilters.areaMin) return false;
      if (currentFilters.areaMax !== undefined && prop.area > currentFilters.areaMax) return false;
      if (currentFilters.heating && currentFilters.heating.length > 0 && !currentFilters.heating.includes(prop.heating)) return false;
      if (currentFilters.balcony !== undefined && currentFilters.balcony && !prop.balcony) return false;
      if (currentFilters.dishwasher !== undefined && currentFilters.dishwasher && !prop.dishwasher) return false;
      if (currentFilters.oven !== undefined && currentFilters.oven && !prop.oven) return false;
      if (currentFilters.pets !== undefined && currentFilters.pets && !prop.pets) return false;
      if (currentFilters.searchQuery) {
        const query = currentFilters.searchQuery.toLowerCase();
        if (!prop.address.toLowerCase().includes(query) && !(prop.name || '').toLowerCase().includes(query) && !prop.description.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, []);

  const handleFiltersChange = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    // Simulate delay for filter application
    setTimeout(() => {
      setFilteredProperties(applyFilters(properties, newFilters));
      setIsLoading(false);
    }, 300);
  }, [properties, applyFilters]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar onFiltersChange={handleFiltersChange} initialFilters={filters} />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-card">
            <div className="container mx-auto flex justify-end">
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="mr-2 gap-2"
              >
                <MapIcon className="h-4 w-4" /> Map View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="gap-2"
              >
                <ListIcon className="h-4 w-4" /> List View
              </Button>
            </div>
          </div>

          <main className="flex-1 overflow-auto p-0 md:p-1 relative"> {/* Adjusted padding for map */}
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-50">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {viewMode === 'map' && <GoogleMapView properties={filteredProperties} />}
                {viewMode === 'list' && <PropertyListView properties={filteredProperties} />}
              </>
            )}
          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
