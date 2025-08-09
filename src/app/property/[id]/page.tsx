// src/app/property/[id]/page.tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

// Запрещаем динамическую генерацию — строим статический export
export const dynamic = 'error';
export const dynamicParams = false;
// Опционально: обновлять кэш раз в 10 минут
export const revalidate = 600;

// Для output:'export' нужно заранее сообщить все id для маршрута /property/[id]
export async function generateStaticParams() {
  const { data, error } = await supabase
    .from('BinaGE')     // ← проверь название таблицы
    .select('id')
    .limit(10000);

  if (error || !data) return [];

  return data
    .filter((r) => r && r.id !== null && r.id !== undefined)
    .map((r) => ({ id: String(r.id) }));
}

type Property = {
  id: number;
  title?: string;
  price?: number;
  bedrooms?: number;
  address?: string;
  description?: string;
  images?: string[] | null;
  // добавь нужные поля по своей БД
};

async function getPropertyById(id: string): Promise<Property | null> {
  const numericId = Number(id);
  if (Number.isNaN(numericId)) return null;

  const { data, error } = await supabase
    .from('BinaGE')     // ← проверь название таблицы
    .select('*')
    .eq('id', numericId)
    .single();

  if (error) return null;
  return data as Property;
}

export default async function PropertyPage({ params }: { params: { id: string } }) {
  const data = await getPropertyById(params.id);

  if (!data) {
    return <div className="p-4">Объявление не найдено</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{data.title ?? `Объект #${data.id}`}</h1>
      <div className="text-sm opacity-80">{data.address}</div>
      <div className="text-lg">Цена: {data.price ?? '—'}</div>
      <div>Спальни: {data.bedrooms ?? '—'}</div>

      {/* Здесь можешь вывести галерею, карту и т.п. */}
      <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
