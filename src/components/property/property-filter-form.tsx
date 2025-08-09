// src/components/property/property-filter-form.tsx
"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import type { PropertyFilters, Property } from "@/types";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";

/* ------------------------- Schemas ------------------------- */

const heatingTypesSchema = z.enum([
  "central",
  "gas",
  "electric",
  "none",
  "air_conditioner",
  "underfloor_heating",
  "karma",
]);

const rentalTermValueSchema = z.union([
  z.literal(1),
  z.literal(3),
  z.literal(6),
  z.literal(12),
]);

const filterSchema = z
  .object({
    priceMin: z.coerce.number().min(0).optional(),
    priceMax: z.coerce.number().min(0).optional(),
    roomsMin: z.array(z.coerce.number().min(0)).optional(),
    rentalTermMin: z.array(rentalTermValueSchema).optional(),
    areaMin: z.coerce.number().min(0).optional(),
    areaMax: z.coerce.number().min(0).max(300).optional(),
    heating: z.array(heatingTypesSchema).optional(),
    separateKitchen: z.boolean().optional(),
    hasBathtub: z.boolean().optional(),
    dishwasher: z.boolean().optional(),
    oven: z.boolean().optional(),
    pets: z.boolean().optional(),
    searchQuery: z.string().optional(),
  })
  .refine(
    (d) => !d.priceMin || !d.priceMax || d.priceMax >= d.priceMin,
    { message: "Max price must be greater than or equal to min price", path: ["priceMax"] }
  )
  .refine(
    (d) => !d.areaMin || !d.areaMax || d.areaMax >= d.areaMin,
    { message: "Max area must be greater than or equal to min area", path: ["areaMax"] }
  );

type FilterFormValues = z.infer<typeof filterSchema>;

interface PropertyFilterFormProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  initialFilters?: PropertyFilters;
}

/* --------------------- Defaults & options --------------------- */

const defaultFilterValues: PropertyFilters = {
  priceMin: 0,
  priceMax: 5000,
  roomsMin: [1],
  rentalTermMin: [12],
  areaMin: 30,
  areaMax: 300,
  heating: [],
  separateKitchen: false,
  hasBathtub: false,
  dishwasher: false,
  oven: false,
  pets: false,
  searchQuery: "",
};

const heatingOptionsForDisplay = [
  { value: "any", labelKey: "propertyFilterForm.heatingOptions.any" },
  { value: "central", labelKey: "propertyFilterForm.heatingOptions.central" },
  { value: "electric", labelKey: "propertyFilterForm.heatingOptions.electric" },
  { value: "air_conditioner", labelKey: "propertyFilterForm.heatingOptions.air_conditioner" },
  { value: "underfloor_heating", labelKey: "propertyFilterForm.heatingOptions.underfloor_heating" },
  { value: "karma", labelKey: "propertyFilterForm.heatingOptions.karma" },
] as const;

const roomOptions: { value: number; labelKey: string }[] = [
  { value: 0, labelKey: "propertyFilterForm.roomsOptions.studio" },
  { value: 1, labelKey: "propertyFilterForm.roomsOptions.onePlusOne" },
  { value: 2, labelKey: "propertyFilterForm.roomsOptions.twoPlusOne" },
  { value: 3, labelKey: "propertyFilterForm.roomsOptions.threePlusOne" },
  { value: 4, labelKey: "propertyFilterForm.roomsOptions.fourPlusPlus" },
];

const rentalTermOptions: { value: 1 | 3 | 6 | 12; labelKey: string }[] = [
  { value: 12, labelKey: "propertyFilterForm.rentalTermOptions.twelveMonths" },
  { value: 6, labelKey: "propertyFilterForm.rentalTermOptions.sixMonths" },
  { value: 3, labelKey: "propertyFilterForm.rentalTermOptions.threeMonths" },
  { value: 1, labelKey: "propertyFilterForm.rentalTermOptions.oneMonth" },
];

/* ------------------------- Component ------------------------- */

export function PropertyFilterForm({
  onFiltersChange,
  initialFilters = defaultFilterValues,
}: PropertyFilterFormProps) {
  const { t } = useTranslation();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialFilters,
  });

  // Диапазон цены (кортеж [min, max])
  const [currentPriceRange, setCurrentPriceRange] =
    React.useState<[number, number]>([
      initialFilters?.priceMin ?? defaultFilterValues.priceMin!,
      initialFilters?.priceMax ?? defaultFilterValues.priceMax!,
    ]);

  // Диапазон площади (кортеж [min, max])
  const [currentAreaRange, setCurrentAreaRange] =
    React.useState<[number, number]>([
      initialFilters?.areaMin ?? defaultFilterValues.areaMin!,
      initialFilters?.areaMax ?? defaultFilterValues.areaMax!,
    ]);

  function onSubmit(data: FilterFormValues) {
    onFiltersChange(data);
  }

  const handleResetFilters = () => {
    form.reset(defaultFilterValues);
    setCurrentPriceRange([
      defaultFilterValues.priceMin!,
      defaultFilterValues.priceMax!,
    ]);
    setCurrentAreaRange([
      defaultFilterValues.areaMin!,
      defaultFilterValues.areaMax!,
    ]);
    onFiltersChange(defaultFilterValues);
  };

  // Синхронизируем локальные слайдеры с формой при ручном вводе
  React.useEffect(() => {
    const sub = form.watch((value, { name }) => {
      if (name === "priceMin" || name === "priceMax") {
        setCurrentPriceRange([
          value.priceMin ?? defaultFilterValues.priceMin!,
          value.priceMax ?? defaultFilterValues.priceMax!,
        ]);
      }
      if (name === "areaMin" || name === "areaMax") {
        setCurrentAreaRange([
          value.areaMin ?? defaultFilterValues.areaMin!,
          value.areaMax ?? defaultFilterValues.areaMax!,
        ]);
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        {/* Поиск */}
        <FormField
          control={form.control}
          name="searchQuery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("propertyFilterForm.searchLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("propertyFilterForm.searchPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Цена */}
        <FormItem>
          <FormLabel>
            {t("propertyFilterForm.priceRangeLabel", {
              min: currentPriceRange[0],
              max: currentPriceRange[1],
            })}
          </FormLabel>
          <Slider
            value={currentPriceRange}
            min={0}
            max={5000}
            step={50}
            onValueChange={(val: number[]) => {
              const [min, max] = val as [number, number];
              setCurrentPriceRange([min, max]);
              form.setValue("priceMin", min, { shouldDirty: true });
              form.setValue("priceMax", max, { shouldDirty: true });
            }}
            className="py-2"
          />
        </FormItem>

        {/* Комнаты */}
        <FormField
          control={form.control}
          name="roomsMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("propertyFilterForm.roomsLabel")}</FormLabel>
              <div className="flex flex-wrap gap-2 pt-1">
                {roomOptions.map((option) => {
                  const isChecked = (field.value ?? []).includes(option.value);
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-md border border-input bg-background px-3 py-1.5 text-xs sm:text-sm shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                        isChecked &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      )}
                      onClick={() => {
                        const currentValue = field.value ?? [];
                        const newValue = isChecked
                          ? currentValue.filter((v) => v !== option.value)
                          : [...currentValue, option.value];
                        field.onChange(newValue);
                      }}
                    >
                      {t(option.labelKey)}
                    </Button>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Срок аренды */}
        <FormField
          control={form.control}
          name="rentalTermMin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("propertyFilterForm.rentalTermLabel")}</FormLabel>
              <div className="flex flex-wrap gap-2 pt-1">
                {rentalTermOptions.map((option) => {
                  const isChecked = (field.value ?? []).includes(option.value);
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-md border border-input bg-background px-3 py-1.5 text-xs sm:text-sm shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                        isChecked &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      )}
                      onClick={() => {
                        const currentValue = field.value ?? [];
                        const newValue = isChecked
                          ? currentValue.filter((v) => v !== option.value)
                          : [...currentValue, option.value];
                        field.onChange(newValue);
                      }}
                    >
                      {t(option.labelKey)}
                    </Button>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Площадь */}
        <FormItem>
          <FormLabel>
            {t("propertyFilterForm.areaLabel", {
              min: currentAreaRange[0],
              max: currentAreaRange[1],
            })}
          </FormLabel>
          <Slider
            value={currentAreaRange}
            min={0}
            max={300}
            step={5}
            onValueChange={(val: number[]) => {
              const [min, max] = val as [number, number];
              setCurrentAreaRange([min, max]);
              form.setValue("areaMin", min, { shouldDirty: true });
              form.setValue("areaMax", max, { shouldDirty: true });
            }}
            className="py-2"
          />
        </FormItem>

        {/* Отопление */}
        <FormField
          control={form.control}
          name="heating"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2">
                <FormLabel className="text-base">
                  {t("propertyFilterForm.heatingTypeLabel")}
                </FormLabel>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {heatingOptionsForDisplay.map((item) => {
                  const isAny = item.value === "any";
                  const isChecked = isAny
                    ? (field.value ?? []).length === 0
                    : (field.value ?? []).includes(item.value as Property["heating"]);

                  return (
                    <Button
                      key={item.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-md border border-input bg-background px-3 py-1.5 text-xs sm:text-sm shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                        isChecked &&
                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      )}
                      onClick={() => {
                        if (isAny) {
                          field.onChange([]);
                          return;
                        }
                        const current = field.value ?? [];
                        const val = item.value as Property["heating"];
                        field.onChange(
                          current.includes(val)
                            ? current.filter((h) => h !== val)
                            : [...current, val]
                        );
                      }}
                    >
                      {t(item.labelKey)}
                    </Button>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Удобства */}
        <div className="space-y-2">
          {(
            [
              { name: "separateKitchen", labelKey: "propertyFilterForm.amenitiesOptions.separateKitchen" },
              { name: "hasBathtub", labelKey: "propertyFilterForm.amenitiesOptions.hasBathtub" },
              { name: "dishwasher", labelKey: "propertyFilterForm.amenitiesOptions.dishwasher" },
              { name: "oven", labelKey: "propertyFilterForm.amenitiesOptions.oven" },
              { name: "pets", labelKey: "propertyFilterForm.amenitiesOptions.petsAllowed" },
            ] as const
          ).map((amenity) => (
            <FormField
              key={amenity.name}
              control={form.control}
              name={amenity.name}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal capitalize">
                    {t(amenity.labelKey)}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* Кнопки */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleResetFilters}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" /> {t("propertyFilterForm.resetButton")}
          </Button>
          <Button
            type="submit"
            className="w-full flex-grow bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {t("propertyFilterForm.applyButton")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

/* --------- (опционально) оставляем RadioGroup для одиночного выбора --------- */

interface StyledRadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
}

function StyledRadioGroup({ value, onValueChange, options }: StyledRadioGroupProps) {
  const baseId = React.useId();
  return (
    <RadioGroup value={value} onValueChange={onValueChange} className="flex flex-wrap gap-2 pt-1">
      {options.map((option) => {
        const itemId = `${baseId}-${option.value}`;
        return (
          <div key={option.value}>
            <RadioGroupItem value={option.value} id={itemId} className="sr-only peer" />
            <Label
              htmlFor={itemId}
              className="block cursor-pointer rounded-md border border-input bg-background px-3 py-1.5 text-xs sm:text-sm shadow-sm hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground transition-colors"
            >
              {option.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
