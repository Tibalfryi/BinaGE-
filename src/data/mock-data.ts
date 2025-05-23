import type { Property } from '@/types';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Sunny Studio with Sea View',
    address: '123 Gorgiladze St, Batumi',
    lat: 41.6430,
    lng: 41.6340,
    price: 500,
    rooms: 0, // Studio
    area: 45,
    floor: 10,
    heating: 'air_conditioner',
    pets: true,
    dishwasher: true,
    oven: true,
    separateKitchen: true, // Was balcony
    hasBathtub: true, // Added
    photo_urls: [
      'https://placehold.co/600x400.png?text=Apartment+1+View+1',
      'https://placehold.co/600x400.png?text=Apartment+1+View+2',
    ],
    description: 'A beautiful and sunny studio apartment with a stunning sea view. Fully furnished and equipped with modern amenities. Pet-friendly!',
    owner_contact: { email: 'owner1@example.com', phone: '+995123456789', telegram: '@owner1_tg' },
    is_favorite: false,
  },
  {
    id: '2',
    name: 'Cozy 2-Room near Park',
    address: '45 Rustaveli Ave, Batumi',
    lat: 41.6500,
    lng: 41.6390,
    price: 750,
    rooms: 2,
    area: 65,
    floor: 3,
    heating: 'underfloor_heating',
    pets: false,
    dishwasher: true,
    oven: false,
    separateKitchen: true, // Was balcony
    hasBathtub: false, // Added
    photo_urls: [
      'https://placehold.co/600x400.png?text=Apartment+2+View+1',
    ],
    description: 'A cozy two-room apartment located near a beautiful park. Ideal for families. No pets allowed.',
    owner_contact: { email: 'owner2@example.com', telegram: '@owner2_tg' },
    is_favorite: true,
  },
  {
    id: '3',
    name: 'Modern Loft Downtown',
    address: '78 Chavchavadze St, Batumi',
    lat: 41.6475,
    lng: 41.6300,
    price: 900,
    rooms: 1,
    area: 80,
    floor: 5,
    heating: 'karma',
    pets: true,
    dishwasher: false,
    oven: true,
    separateKitchen: false, // Was balcony
    hasBathtub: true, // Added
    photo_urls: [
      'https://placehold.co/600x400.png?text=Apartment+3+View+1',
      'https://placehold.co/600x400.png?text=Apartment+3+View+2',
      'https://placehold.co/600x400.png?text=Apartment+3+View+3',
    ],
    description: 'Spacious and modern loft-style apartment in the heart of Batumi. Close to all attractions and nightlife.',
    owner_contact: { phone: '+995987654321' },
    is_favorite: false,
  },
  {
    id: '4',
    name: 'Family Apartment with Garden Access',
    address: '12 Pushkin St, Batumi',
    lat: 41.6380,
    lng: 41.6250,
    price: 600,
    rooms: 3,
    area: 90,
    floor: 1,
    heating: 'central',
    pets: false,
    dishwasher: true,
    oven: true,
    separateKitchen: true, // Was balcony
    hasBathtub: true, // Added
    photo_urls: [
      'https://placehold.co/600x400.png?text=Apartment+4+View+1',
    ],
    description: 'Large family apartment on the first floor with access to a shared garden. Quiet neighborhood.',
    owner_contact: { email: 'owner4@example.com', phone: '+995555112233', telegram: '@owner4_tg' },
    is_favorite: false,
  },
  {
    id: '5',
    name: 'Penthouse with Panoramic Views',
    address: '200 Khimshiashvili St, Batumi',
    lat: 41.6300,
    lng: 41.6100, 
    price: 1500,
    rooms: 4,
    area: 150,
    floor: 25,
    heating: 'electric',
    pets: true,
    dishwasher: true,
    oven: true,
    separateKitchen: false, // Was balcony
    hasBathtub: true, // Added
    photo_urls: [
      'https://placehold.co/600x400.png?text=Apartment+5+View+1',
      'https://placehold.co/600x400.png?text=Apartment+5+View+2',
    ],
    description: 'Luxurious penthouse apartment with breathtaking panoramic views of the Black Sea and the city. Top-tier amenities.',
    owner_contact: { telegram: '@luxury_penthouse_batumi' },
    is_favorite: false,
  }
];
