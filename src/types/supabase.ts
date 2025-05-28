
// src/types/supabase.ts

// Типы для вашей базы данных Supabase.
// Рекомендуется генерировать их с помощью `supabase gen types typescript > src/types/supabase.ts`
// или `npx supabase gen types typescript --project-id "$PROJECT_REF" > src/types/supabase.ts`
// Это обеспечит их точность и актуальность.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      BinaGE: {
        Row: {
          address: string | null
          area: number | null
          description: string | null
          dishwasher: boolean | null
          floor: number | null
          hasBathtub: boolean | null
          heating: string | null // Consider using specific enum types if possible
          id: number // primary key, in Supabase it's int8
          is_favorite: boolean | null
          lat: number | null // Added based on screenshot
          lng: number | null // Added based on screenshot
          name: string | null // This might map from a 'title' column in Supabase
          oven: boolean | null
          owner_contact: Json | null // Assuming this is a JSONB column storing contact object
                                      // If it's owner_id (uuid) as per screenshot, mapping needs adjustment
          owner_id: string | null // Added based on screenshot (uuid)
          pets: boolean | null
          photo_urls: string[] | null // Assuming 'text[]' in Supabase
          price: number | null
          rooms: number | null
          separateKitchen: boolean | null
          title: string | null // If 'title' is the actual column name in Supabase for 'name' field of Property
                               // The mapping function currently checks supabaseItem.title || supabaseItem.name
        }
        Insert: {
          address?: string | null
          area?: number | null
          description?: string | null
          dishwasher?: boolean | null
          floor?: number | null
          hasBathtub?: boolean | null
          heating?: string | null
          id?: number // id is usually auto-generated
          is_favorite?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          oven?: boolean | null
          owner_contact?: Json | null
          owner_id?: string | null
          pets?: boolean | null
          photo_urls?: string[] | null
          price?: number | null
          rooms?: number | null
          separateKitchen?: boolean | null
          title?: string | null
        }
        Update: {
          address?: string | null
          area?: number | null
          description?: string | null
          dishwasher?: boolean | null
          floor?: number | null
          hasBathtub?: boolean | null
          heating?: string | null
          id?: number
          is_favorite?: boolean | null
          lat?: number | null
          lng?: number | null
          name?: string | null
          oven?: boolean | null
          owner_contact?: Json | null
          owner_id?: string | null
          pets?: boolean | null
          photo_urls?: string[] | null
          price?: number | null
          rooms?: number | null
          separateKitchen?: boolean | null
          title?: string | null
        }
        Relationships: [] // Define relationships if any
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
