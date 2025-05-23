
export interface Property {
  id: string;
  address: string;
  lat: number;
  lng: number;
  price: number; // USD
  rooms: number; // 0 for studio, 1 for 1-room, etc.
  area: number; // m2
  floor: number;
  heating: 'central' | 'gas' | 'electric' | 'none' | 'air_conditioner' | 'underfloor_heating' | 'karma'; // Example types
  pets: boolean;
  dishwasher: boolean;
  oven: boolean;
  separateKitchen: boolean; // Changed from balcony
  hasBathtub: boolean; // Added
  photo_urls: string[];
  description: string;
  is_favorite?: boolean; // For current user context
  owner_contact: {
    email?: string;
    phone?: string;
    telegram?: string;
  };
  name?: string; // Optional short name/title for the property
  // min_rental_period?: 1 | 3 | 6 | 12; // Example: if properties had this field
}

export interface PropertyFilters {
  priceMin?: number;
  priceMax?: number;
  roomsMin?: number[]; // Changed from number
  areaMin?: number;
  areaMax?:number;
  heating?: Property['heating'][];
  separateKitchen?: boolean; // Changed from balcony
  hasBathtub?: boolean; // Added
  dishwasher?: boolean;
  oven?: boolean;
  pets?: boolean;
  searchQuery?: string;
  rentalTermMin?: (1 | 3 | 6 | 12)[]; // Changed from single value
}
