// src/lib/supabase-mappers.ts
import type { Property } from '@/types';

// Берём точный union-тип из модели Property
type HeatingType = NonNullable<Property['heating']>;

// Карта: код -> русская подпись (используй в UI при показе)
export const heatingLabelMap: Record<HeatingType, string> = {
  central: 'Центральное',
  gas: 'Газовое',
  electric: 'Электрическое',
  none: 'Нет',
  air_conditioner: 'Кондиционер',
  underfloor_heating: 'Тёплый пол',
  karma: 'Карма',
};

// type guard, что строка — валидный HeatingType
const isHeatingType = (v: string): v is HeatingType => {
  return (v as HeatingType) in heatingLabelMap;
};

export const mapSupabaseToProperty = (supabaseItem: any, index?: number): Property | null => {
  try {
    // Проверки ID
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

    // Фото
    const photoUrlsRaw = supabaseItem.photo_urls;
    let photo_urls: string[] = [];
    if (Array.isArray(photoUrlsRaw)) {
      photo_urls = photoUrlsRaw.reduce((acc: string[], url: any) => {
        if (typeof url === 'string' && url.trim().startsWith('http')) acc.push(url.trim());
        return acc;
      }, []);
    } else if (typeof photoUrlsRaw === 'string' && photoUrlsRaw.trim().startsWith('http')) {
      photo_urls = [photoUrlsRaw.trim()];
    }

    // Контакты владельца
    let owner_contact: Record<string, unknown> = {};
    if (typeof supabaseItem.owner_contact === 'object' && supabaseItem.owner_contact !== null) {
      owner_contact = supabaseItem.owner_contact;
    } else if (typeof supabaseItem.owner_contact === 'string') {
      try {
        const parsed = JSON.parse(supabaseItem.owner_contact);
        if (typeof parsed === 'object' && parsed !== null) owner_contact = parsed;
      } catch {
        owner_contact = {};
      }
    }

    // Нормализуем heating к union-типу; по умолчанию 'none'
    const rawHeating = String(supabaseItem.heating ?? '').trim().toLowerCase();
    const heating: HeatingType = isHeatingType(rawHeating) ? rawHeating : 'none';

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
      heating, // <-- union-значение, строго по типу Property['heating']
      pets: supabaseItem.pets === true,
      dishwasher: supabaseItem.dishwasher === true,
      oven: supabaseItem.oven === true,
      separateKitchen: supabaseItem.separateKitchen === true,
      hasBathtub: supabaseItem.hasBathtub === true,
      photo_urls,
      description: supabaseItem.description || '',
      is_favorite: supabaseItem.is_favorite === true,
      owner_contact,
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
