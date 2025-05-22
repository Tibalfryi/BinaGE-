// @/components/property/property-filter-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import type { PropertyFilters } from "@/types";
import React from "react";

const heatingOptions = [
  { value: "central", label: "Central" },
  { value: "gas", label: "Gas" },
  { value: "electric", label: "Electric" },
  { value: "none", label: "None" },
] as const;

const filterSchema = z.object({
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  roomsMin: z.coerce.number().min(0).optional(), // 0 for studio
  areaMin: z.coerce.number().min(0).optional(),
  areaMax: z.coerce.number().min(0).optional(),
  heating: z.array(z.enum(heatingOptions.map(h => h.value) as [string, ...string[]])).optional(),
  balcony: z.boolean().optional(),
  dishwasher: z.boolean().optional(),
  oven: z.boolean().optional(),
  pets: z.boolean().optional(),
  searchQuery: z.string().optional(),
}).refine(data => !data.priceMin || !data.priceMax || data.priceMax >= data.priceMin, {
  message: "Max price must be greater than or equal to min price",
  path: ["priceMax"],
}).refine(data => !data.areaMin || !data.areaMax || data.areaMax >= data.areaMin, {
  message: "Max area must be greater than or equal to min area",
  path: ["areaMax"],
});

type FilterFormValues = z.infer<typeof filterSchema>;

interface PropertyFilterFormProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  initialFilters?: PropertyFilters;
}

export function PropertyFilterForm({ onFiltersChange, initialFilters }: PropertyFilterFormProps) {
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      priceMin: initialFilters?.priceMin ?? 0,
      priceMax: initialFilters?.priceMax ?? 5000,
      roomsMin: initialFilters?.roomsMin ?? 0,
      areaMin: initialFilters?.areaMin ?? 0,
      areaMax: initialFilters?.areaMax ?? 300,
      heating: initialFilters?.heating ?? [],
      balcony: initialFilters?.balcony ?? false,
      dishwasher: initialFilters?.dishwasher ?? false,
      oven: initialFilters?.oven ?? false,
      pets: initialFilters?.pets ?? false,
      searchQuery: initialFilters?.searchQuery ?? "",
    },
  });

  const [currentPriceRange, setCurrentPriceRange] = React.useState([
    initialFilters?.priceMin ?? 0,
    initialFilters?.priceMax ?? 5000,
  ]);
  
  const [currentAreaRange, setCurrentAreaRange] = React.useState([
    initialFilters?.areaMin ?? 0,
    initialFilters?.areaMax ?? 300,
  ]);

  function onSubmit(data: FilterFormValues) {
    onFiltersChange(data);
  }
  
  // Debounce apply filters
  React.useEffect(() => {
    const subscription = form.watch((values) => {
       onFiltersChange(values as PropertyFilters);
    });
    return () => subscription.unsubscribe();
  }, [form, onFiltersChange]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search by Address/Keyword</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Gorgiladze St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Price Range (USD): ${currentPriceRange[0]} - ${currentPriceRange[1]}</FormLabel>
          <Slider
            defaultValue={[currentPriceRange[0], currentPriceRange[1]]}
            min={0}
            max={5000}
            step={50}
            onValueChange={(value) => {
              setCurrentPriceRange(value);
              form.setValue("priceMin", value[0]);
              form.setValue("priceMax", value[1]);
            }}
            className="py-2"
          />
        </FormItem>

        <FormField
          control={form.control}
          name="roomsMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Rooms</FormLabel>
              <SelectInput
                value={field.value?.toString() ?? "0"}
                onValueChange={(val) => field.onChange(parseInt(val,10))}
                options={[
                  { value: "0", label: "Studio / Any" },
                  { value: "1", label: "1+ Room" },
                  { value: "2", label: "2+ Rooms" },
                  { value: "3", label: "3+ Rooms" },
                  { value: "4", label: "4+ Rooms" },
                ]}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>Area (m²): {currentAreaRange[0]} - {currentAreaRange[1]}</FormLabel>
          <Slider
            defaultValue={[currentAreaRange[0], currentAreaRange[1]]}
            min={0}
            max={300}
            step={5}
            onValueChange={(value) => {
              setCurrentAreaRange(value);
              form.setValue("areaMin", value[0]);
              form.setValue("areaMax", value[1]);
            }}
            className="py-2"
          />
        </FormItem>

        <FormField
          control={form.control}
          name="heating"
          render={() => (
            <FormItem>
              <div className="mb-2">
                <FormLabel className="text-base">Heating Type</FormLabel>
              </div>
              {heatingOptions.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name="heating"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.value}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value ?? []), item.value])
                                : field.onChange(
                                    (field.value ?? []).filter(
                                      (value) => value !== item.value
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel className="text-base">Amenities</FormLabel>
          {[ "balcony", "dishwasher", "oven", "pets" ].map(amenity => (
            <FormField
              key={amenity}
              control={form.control}
              name={amenity as "balcony" | "dishwasher" | "oven" | "pets"}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal capitalize">
                    {amenity === 'pets' ? 'Pets Allowed' : amenity}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Apply Filters</Button>
      </form>
    </Form>
  );
}

// Custom Select component for reusability if Radix Select is too complex for simple cases
interface SelectInputProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function SelectInput({ value, onValueChange, options }: SelectInputProps) {
  // Using RadioGroup as a simpler select for this context
  return (
    <RadioGroup value={value} onValueChange={onValueChange} className="grid grid-cols-2 gap-2">
      {options.map(option => (
        <FormItem key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={`rooms-${option.value}`} />
          <Label htmlFor={`rooms-${option.value}`} className="font-normal">{option.label}</Label>
        </FormItem>
      ))}
    </RadioGroup>
  )
}
