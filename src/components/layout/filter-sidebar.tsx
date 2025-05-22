// @/components/layout/filter-sidebar.tsx
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar"; 
import { PropertyFilterForm } from "@/components/property/property-filter-form";
import type { PropertyFilters } from "@/types";
import { FilterIcon } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";


interface FilterSidebarProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  initialFilters?: PropertyFilters;
}

export function FilterSidebar({ onFiltersChange, initialFilters }: FilterSidebarProps) {
  const { t } = useTranslation();
  return (
    <Sidebar side="left" collapsible="icon" className="border-r">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
           <h2 className="text-lg font-semibold flex items-center gap-2">
            <FilterIcon className="h-5 w-5" />
            {t('filterSidebar.title')}
          </h2>
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
