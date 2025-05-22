// @/components/layout/filter-sidebar.tsx
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTitle,
  SidebarClose,
} from "@/components/ui/sidebar"; // Assuming these subcomponents exist or using Dialog parts
import { PropertyFilterForm } from "@/components/property/property-filter-form";
import type { PropertyFilters } from "@/types";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";


interface FilterSidebarProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  initialFilters?: PropertyFilters;
}

export function FilterSidebar({ onFiltersChange, initialFilters }: FilterSidebarProps) {
  return (
    <Sidebar side="left" collapsible="icon" className="border-r">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-semibold flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            Filters
          </h2>
          {/* SidebarClose might be needed if it's a sheet-like behavior on mobile */}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <PropertyFilterForm 
          onFiltersChange={onFiltersChange}
          initialFilters={initialFilters}
        />
      </SidebarContent>
    </Sidebar>
  );
}
