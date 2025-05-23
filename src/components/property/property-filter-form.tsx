
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
import { RotateCcw } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const heatingOptions = [
  { value: "central", labelKey: "propertyFilterForm.heatingOptions.central" },
  { value: "gas", labelKey: "propertyFilterForm.heatingOptions.gas" },
  { value: "electric", labelKey: "propertyFilterForm.heatingOptions.electric" },
  { value: "none", labelKey: "propertyFilterForm.heatingOptions.none" },
] as const;

const filterSchema = z.object({
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  roomsMin: z.coerce.number().min(0).optional(), 
  areaMin: z.coerce.number().min(0).optional(),
  areaMax: z.coerce.number().min(0).max(300).optional(), // Max area validation
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

const defaultFilterValues: PropertyFilters = {
  priceMin: 0,
  priceMax: 5000,
  roomsMin: 0,
  areaMin: 30, // Default min area adjusted from 300 back to a more common value
  areaMax: 300,
  heating: [],
  balcony: false,
  dishwasher: false,
  oven: false,
  pets: false,
  searchQuery: "",
};

export function PropertyFilterForm({ onFiltersChange, initialFilters = defaultFilterValues }: PropertyFilterFormProps) {
  const { t } = useTranslation();
  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialFilters,
  });

  const [currentPriceRange, setCurrentPriceRange] = React.useState<[number, number]>([
    initialFilters?.priceMin ?? defaultFilterValues.priceMin!,
    initialFilters?.priceMax ?? defaultFilterValues.priceMax!,
  ]);
  
  const [currentAreaRange, setCurrentAreaRange] = React.useState<[number, number]>([
    initialFilters?.areaMin ?? defaultFilterValues.areaMin!,
    initialFilters?.areaMax ?? defaultFilterValues.areaMax!,
  ]);

  // This function is called when form.watch detects a change
  // We only call onFiltersChange if the form is valid and the "Apply Filters" button would be clicked.
  // However, the current design applies filters explicitly via button.
  // So, this useEffect reacting to form.watch and calling onFiltersChange is removed
  // to align with "Apply Filters" button controlling the filter application.

  // Instead, we just submit the form's data when the submit button is pressed.
  function onSubmit(data: FilterFormValues) {
    // Ensure priceMin and priceMax from the slider are included if they were form fields
    // Or directly use currentPriceRange if slider values are not part of react-hook-form's state.
    // The current setup correctly uses form.setValue to update priceMin and priceMax
    // from the slider's onValueChange.
    onFiltersChange(data);
  }

  const handleResetFilters = () => {
    form.reset(defaultFilterValues);
    setCurrentPriceRange([defaultFilterValues.priceMin!, defaultFilterValues.priceMax!]);
    setCurrentAreaRange([defaultFilterValues.areaMin!, defaultFilterValues.areaMax!]);
    // Optionally, call onFiltersChange immediately on reset, or require "Apply Filters"
    onFiltersChange(defaultFilterValues); 
  };
  
  // Update local state for sliders when form values change (e.g. on reset)
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setCurrentPriceRange([value.priceMin ?? defaultFilterValues.priceMin!, value.priceMax ?? defaultFilterValues.priceMax!]);
      setCurrentAreaRange([value.areaMin ?? defaultFilterValues.areaMin!, value.areaMax ?? defaultFilterValues.areaMax!]);
    });
    return () => subscription.unsubscribe();
  }, [form, defaultFilterValues.priceMin, defaultFilterValues.priceMax, defaultFilterValues.areaMin, defaultFilterValues.areaMax]);


  const roomOptions = [
    { value: "0", labelKey: "propertyFilterForm.roomsOptions.any" },
    { value: "1", labelKey: "propertyFilterForm.roomsOptions.onePlus" },
    { value: "2", labelKey: "propertyFilterForm.roomsOptions.twoPlus" },
    { value: "3", labelKey: "propertyFilterForm.roomsOptions.threePlus" },
    { value: "4", labelKey: "propertyFilterForm.roomsOptions.fourPlus" },
  ];

  const amenities = [
    { name: "balcony", labelKey: "propertyFilterForm.amenitiesOptions.balcony" },
    { name: "dishwasher", labelKey: "propertyFilterForm.amenitiesOptions.dishwasher" },
    { name: "oven", labelKey: "propertyFilterForm.amenitiesOptions.oven" },
    { name: "pets", labelKey: "propertyFilterForm.amenitiesOptions.petsAllowed" }
  ] as const;


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('propertyFilterForm.searchLabel')}</FormLabel>
              <FormControl>
                <Input placeholder={t('propertyFilterForm.searchPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>{t('propertyFilterForm.priceRangeLabel', {min: currentPriceRange[0], max: currentPriceRange[1]})}</FormLabel>
          <Slider
            value={currentPriceRange} // Use the local state for the slider's value
            min={0}
            max={5000}
            step={50} // Step set to 50
            onValueChange={(value) => {
              setCurrentPriceRange(value); // Update local state for visual feedback
              form.setValue("priceMin", value[0], { shouldDirty: true });
              form.setValue("priceMax", value[1], { shouldDirty: true });
            }}
            className="py-2"
          />
           {/* Hidden inputs to register priceMin and priceMax with react-hook-form if needed,
               but form.setValue already does this. Kept for clarity/explicitness if preferred.
               Alternatively, ensure priceMin and priceMax are part of form state via other means or handled directly.
               The current approach with form.setValue is fine.
           */}
        </FormItem>
        {/* Ensure form fields for priceMin and priceMax exist if not directly controlled by Slider */}
        {/* These are implicitly handled by form.setValue in onValueChange of the Slider */}


        <FormField
          control={form.control}
          name="roomsMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('propertyFilterForm.minRoomsLabel')}</FormLabel>
              <SelectInput
                value={field.value?.toString() ?? "0"}
                onValueChange={(val) => field.onChange(parseInt(val,10))}
                options={roomOptions.map(opt => ({ value: opt.value, label: t(opt.labelKey) }))}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>{t('propertyFilterForm.areaLabel', {min: currentAreaRange[0], max: currentAreaRange[1]})}</FormLabel>
          <Slider
            value={currentAreaRange} // Use the local state for the slider's value
            min={0}
            max={300}
            step={5}
            onValueChange={(value) => {
              setCurrentAreaRange(value); // Update local state for visual feedback
              form.setValue("areaMin", value[0], { shouldDirty: true });
              form.setValue("areaMax", value[1], { shouldDirty: true });
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
                <FormLabel className="text-base">{t('propertyFilterForm.heatingTypeLabel')}</FormLabel>
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
                          {t(item.labelKey)}
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
          <FormLabel className="text-base">{t('propertyFilterForm.amenitiesLabel')}</FormLabel>
          {amenities.map(amenity => (
            <FormField
              key={amenity.name}
              control={form.control}
              name={amenity.name}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal capitalize">
                    {t(amenity.labelKey)}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button type="button" variant="outline" onClick={handleResetFilters} className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" /> {t('propertyFilterForm.resetButton')}
          </Button>
          <Button type="submit" className="w-full flex-grow bg-primary hover:bg-primary/90 text-primary-foreground">{t('propertyFilterForm.applyButton')}</Button>
        </div>
      </form>
    </Form>
  );
}

interface SelectInputProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function SelectInput({ value, onValueChange, options }: SelectInputProps) {
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
