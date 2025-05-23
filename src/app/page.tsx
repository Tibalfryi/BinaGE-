
// src/app/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { FilterSidebar } from '@/components/layout/filter-sidebar';
import { GoogleMapView } from '@/components/map/google-map-view';
import { PropertyListView } from '@/components/property/property-list-view';
import { Button } from '@/components/ui/button';
import { MapIcon, ListIcon, Loader2, ArrowDownNarrowWide, ArrowUpNarrowWide } from 'lucide-react';
import type { Property, PropertyFilters } from '@/types';
import { mockProperties } from '@/data/mock-data';
import { SidebarInset } from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from '@/hooks/use-translation';


type ViewMode = 'map' | 'list';
type SortOrder = 'none' | 'price_asc' | 'price_desc';

const defaultFilters: PropertyFilters = {
  priceMin: 0,
  priceMax: 5000,
  roomsMin: 0, 
  areaMin: 30,
  areaMax: 300,
  heating: [],
  separateKitchen: false, // Changed from balcony
  hasBathtub: false, // Added
  dishwasher: false,
  oven: false,
  pets: false,
  searchQuery: "",
};

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    setProperties(mockProperties);
  }, []);

  const applyFiltersAndSorting = useCallback((allProps: Property[], currentFilters: PropertyFilters, currentSortOrder: SortOrder): Property[] => {
    let processedProps = allProps.filter(prop => {
      if (currentFilters.priceMin !== undefined && prop.price < currentFilters.priceMin) return false;
      if (currentFilters.priceMax !== undefined && prop.price > currentFilters.priceMax) return false;
      
      if (currentFilters.roomsMin !== undefined) {
        if (currentFilters.roomsMin === 0) { 
          if (prop.rooms !== 0) return false; 
        } else { 
          if (prop.rooms < currentFilters.roomsMin) return false;
        }
      }
      
      if (currentFilters.areaMin !== undefined && prop.area < currentFilters.areaMin) return false;
      if (currentFilters.areaMax !== undefined && prop.area > currentFilters.areaMax) return false;
      if (currentFilters.heating && currentFilters.heating.length > 0 && !currentFilters.heating.includes(prop.heating)) return false;
      
      if (currentFilters.separateKitchen !== undefined && currentFilters.separateKitchen && !prop.separateKitchen) return false;
      if (currentFilters.hasBathtub !== undefined && currentFilters.hasBathtub && !prop.hasBathtub) return false;
      if (currentFilters.dishwasher !== undefined && currentFilters.dishwasher && !prop.dishwasher) return false;
      if (currentFilters.oven !== undefined && currentFilters.oven && !prop.oven) return false;
      if (currentFilters.pets !== undefined && currentFilters.pets && !prop.pets) return false;
      
      if (currentFilters.searchQuery) {
        const query = currentFilters.searchQuery.toLowerCase();
        const nameMatch = (prop.name || '').toLowerCase().includes(query);
        const addressMatch = prop.address.toLowerCase().includes(query);
        const descriptionMatch = prop.description.toLowerCase().includes(query);
        if (!nameMatch && !addressMatch && !descriptionMatch) {
          return false;
        }
      }
      return true;
    });

    if (currentSortOrder === 'price_asc') {
      processedProps.sort((a, b) => a.price - b.price);
    } else if (currentSortOrder === 'price_desc') {
      processedProps.sort((a, b) => b.price - a.price);
    }
    
    return processedProps;
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      const newFilteredSortedProperties = applyFiltersAndSorting(properties, filters, sortOrder);
      setFilteredProperties(newFilteredSortedProperties);
      setIsLoading(false);
    }, 300); 
    return () => clearTimeout(timer);
  }, [properties, filters, sortOrder, applyFiltersAndSorting]);


  const handleFiltersChange = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = (value: string) => {
    setSortOrder(value as SortOrder);
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <FilterSidebar onFiltersChange={handleFiltersChange} initialFilters={filters} />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-card">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full sm:w-auto">
                 <Select value={sortOrder} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder={t('homePage.sortByPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('homePage.sortOptions.none')}</SelectItem>
                    <SelectItem value="price_asc">
                      <div className="flex items-center gap-2">
                        <ArrowUpNarrowWide className="h-4 w-4" /> {t('homePage.sortOptions.priceAsc')}
                      </div>
                    </SelectItem>
                    <SelectItem value="price_desc">
                       <div className="flex items-center gap-2">
                        <ArrowDownNarrowWide className="h-4 w-4" /> {t('homePage.sortOptions.priceDesc')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className="mr-2 gap-2"
                >
                  <MapIcon className="h-4 w-4" /> {t('homePage.mapViewButton')}
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <ListIcon className="h-4 w-4" /> {t('homePage.listViewButton')}
                </Button>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-auto p-0 md:p-1 relative"> 
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
