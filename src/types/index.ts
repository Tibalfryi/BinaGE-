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
  balcony: boolean;
  photo_urls: string[];
  description: string;
  is_favorite?: boolean; // For current user context
  owner_contact: {
    email?: string;
    phone?: string;
    telegram?: string;
  };
  name?: string; // Optional short name/title for the property
}

export interface PropertyFilters {
  priceMin?: number;
  priceMax?: number;
  roomsMin?: number;
  areaMin?: number;
  areaMax?:number;
  heating?: Property['heating'][];
  balcony?: boolean;
  dishwasher?: boolean;
  oven?: boolean;
  pets?: boolean;
  searchQuery?: string;
}
