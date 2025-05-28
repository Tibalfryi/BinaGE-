
// src/lib/supabase-mappers.ts
import type { Property } from '@/types';

// Defines a mapping from heating system codes to Russian display names.
const heatingTypeMap: Record<string, string> = {
  central: 'Центральное',
  gas: 'Газовое',
  electric: 'Электрическое',
  none: 'Нет',
  air_conditioner: 'Кондиционер',
  underfloor_heating: 'Теплый пол',
  karma: 'Карма',
};

export const mapSupabaseToProperty = (supabaseItem: any, index?: number): Property | null => {
  try {
    // Check for essential data: id, lat, lng
    if (!supabaseItem || supabaseItem.id === null || supabaseItem.id === undefined) {
      console.warn(`Property data is invalid or missing ID${index !== undefined ? ` at index ${index}` : ''}. Skipping. Data:`, supabaseItem);
      return null;
    }

    const lat = parseFloat(String(supabaseItem.lat));
    const lng = parseFloat(String(supabaseItem.lng));

    if (isNaN(lat) || isNaN(lng)) {
      console.warn(`Property with ID ${supabaseItem.id}${index !== undefined ? ` at index ${index}` : ''} has invalid or missing coordinates. Lat: ${supabaseItem.lat}, Lng: ${supabaseItem.lng}. Skipping.`);
      return null;
    }

    // Robust handling of photo_urls
    const photoUrlsRaw = supabaseItem.photo_urls;
    let photoUrls: string[] = [];
    if (Array.isArray(photoUrlsRaw)) {
      photoUrls = photoUrlsRaw.reduce((acc: string[], url: any) => {
        if (typeof url === 'string' && url.trim().startsWith('http')) {
          acc.push(url.trim());
        } else if (typeof url === 'string' && url.trim() !== '') {
          // Log potentially problematic but non-empty strings if they don't start with http
          // console.warn(`Property with ID ${supabaseItem.id}: photo_url item "${url}" is not a valid starting URL, skipping.`);
        }
        return acc;
      }, []);
    } else if (typeof photoUrlsRaw === 'string' && photoUrlsRaw.trim().startsWith('http')) {
      photoUrls = [photoUrlsRaw.trim()];
    } else if (typeof photoUrlsRaw === 'string' && photoUrlsRaw.trim() !== '') {
      // console.warn(`Property with ID ${supabaseItem.id}: photo_urls field "${photoUrlsRaw}" is a single string but not a valid starting URL, treating as no photos.`);
    }


    // Ensure owner_contact is an object
    let ownerContact = {};
    if (typeof supabaseItem.owner_contact === 'object' && supabaseItem.owner_contact !== null) {
      ownerContact = supabaseItem.owner_contact;
    } else if (typeof supabaseItem.owner_contact === 'string') {
      try {
        ownerContact = JSON.parse(supabaseItem.owner_contact);
        if (typeof ownerContact !== 'object' || ownerContact === null) {
          ownerContact = {}; // Reset if parsing result is not an object
        }
      } catch (e) {
        // console.warn(`Property with ID ${supabaseItem.id}: owner_contact string could not be parsed as JSON. Raw: ${supabaseItem.owner_contact}`);
        ownerContact = {};
      }
    }
    
    const heatingValue = supabaseItem.heating as keyof typeof heatingTypeMap;

    return {
      id: String(supabaseItem.id),
      name: supabaseItem.title || supabaseItem.name || `Квартира #${supabaseItem.id}`,
      address: supabaseItem.address || 'Адрес не указан',
      lat: lat,
      lng: lng,
      price: Number(supabaseItem.price) || 0,
      rooms: (supabaseItem.rooms === null || supabaseItem.rooms === undefined) ? 0 : Number(supabaseItem.rooms),
      area: Number(supabaseItem.area) || 0,
      floor: Number(supabaseItem.floor) || 0,
      heating: heatingTypeMap[heatingValue] ? heatingValue : 'none', // Fallback to 'none' if heating type is unknown
      pets: supabaseItem.pets === true,
      dishwasher: supabaseItem.dishwasher === true,
      oven: supabaseItem.oven === true,
      separateKitchen: supabaseItem.separateKitchen === true,
      hasBathtub: supabaseItem.hasBathtub === true,
      photo_urls: photoUrls,
      description: supabaseItem.description || '',
      is_favorite: supabaseItem.is_favorite === true,
      owner_contact: ownerContact,
    };
  } catch (e) {
    console.error(`Error mapping property data${supabaseItem?.id ? ` for ID ${supabaseItem.id}` : ''}${index !== undefined ? ` at index ${index}` : ''}:`, e, "Raw data:", supabaseItem);
    return null;
  }
};

