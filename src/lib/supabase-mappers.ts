// src/lib/supabase-mappers.ts
import type { Property } from '@/types';

// Разрешённые значения для heating
type HeatingType =
  | 'central'
  | 'gas'
  | 'electric'
  | 'none'
  | 'air_conditioner'
  | 'underfloor_heating'
  | 'karma';

// Маппинг из кода в русский текст
const heatingTypeMap: Record<HeatingType, string> = {
  central: 'Центральное',
  gas: 'Газовое',
  electric: 'Электрическое',
  none: 'Нет',
  air_conditioner: 'Кондиционер',
  underfloor_heating: 'Тёплый пол',
  karma: 'Карма',
};

export const mapSupabaseToProperty = (supabaseItem: any, index?: number): Property | null => {
  try {
    if (!supabaseItem || supabaseItem.id === null || supabaseItem.id === undefined) {
      console.warn(
        `Property data is invalid or missing ID${index !== undefined ? ` at index ${index}` : ''}. Skipping.`,
        supabaseItem
      );
      return null;
    }

    const lat = parseFloat(String(supabaseItem.lat));
    const lng = parseFloat(String(supabaseItem.lng));

    if (isNaN(lat) || isNaN(lng)) {
      console.warn(
        `Property with ID ${supabaseItem.id}${
          index !== undefined ? ` at index ${index}` : ''
        } has invalid coordinates. Lat: ${supabaseItem.lat}, Lng: ${supabaseItem.lng}. Skipping.`
      );
      return null;
    }

    // Обработка фото
    const photoUrlsRaw = supabaseItem.photo_urls;
    let photoUrls: string[] = [];
    if (Array.isArray(photoUrlsRaw)) {
      photoUrls = photoUrlsRaw.reduce((acc: string[], url: any) => {
        if (typeof url === 'string' && url.trim().startsWith('http')) {
          acc.push(url.trim());
        }
        return acc;
      }, []);
    } else if (typeof photoUrlsRaw === 'string' && photoUrlsRaw.trim().startsWith('http')) {
      photoUrls = [photoUrlsRaw.trim()];
    }

    // Контакты владельца
    let ownerContact = {};
    if (typeof supabaseItem.owner_contact === 'object' && supabaseItem.owner_contact !== null) {
      ownerContact = supabaseItem.owner_contact;
    } else if (typeof supabaseItem.owner_contact === 'string') {
      try {
        const parsed = JSON.parse(supabaseItem.owner_contact);
        if (typeof parsed === 'object' && parsed !== null) {
          ownerContact = parsed;
        }
      } catch {
        ownerContact = {};
      }
    }

    // Определяем значение отопления сразу на русском
    const rawHeating = String(supabaseItem.heating ?? '').trim().toLowerCase();
    const heatingText =
      (Object.keys(heatingTypeMap) as HeatingType[]).includes(rawHeating as HeatingType)
        ? heatingTypeMap[rawHeating as HeatingType]
        : heatingTypeMap.none;

    return {
      id: String(supabaseItem.id),
      name: supabaseItem.title || supabaseItem.name || `Квартира #${supabaseItem.id}`,
      address: supabaseItem.address || 'Адрес не указан',
      lat,
      lng,
      price: Number(supabaseItem.price) || 0,
      rooms:
        supabaseItem.rooms === null || supabaseItem.rooms === undefined
          ? 0
          : Number(supabaseItem.rooms),
      area: Number(supabaseItem.area) || 0,
      floor: Number(supabaseItem.floor) || 0,
      heating: heatingText, // сразу русский текст
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
    console.error(
      `Error mapping property data${
        supabaseItem?.id ? ` for ID ${supabaseItem.id}` : ''
      }${index !== undefined ? ` at index ${index}` : ''}:`,
      e,
      'Raw data:',
      supabaseItem
    );
    return null;
  }
};
