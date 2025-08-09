// src/app/property/[id]/page.tsx
import { createClient } from '@supabase/supabase-js';

// Статический экспорт (Next 15 + output: 'export')
export const dynamic = 'error';
export const dynamicParams = false;
export const revalidate = 600;

// Инициализация Supabase (публичные env из секретов)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Сгенерировать список маршрутов для /property/[id]
export async function generateStaticParams() {
  // !!! Проверь имя таблицы. Здесь стоит 'BinaGE'.
  const { data, error } = await supabase.from('BinaGE').select('id').limit(10000);
  if (error || !data) return [];
  return data
    .filter((r) => r?.id !== null && r?.id !== undefined)
    .map((r) => ({ id: String(r.id) }));
}

// Тип params в Next 15 — это Promise
type PageParams = Promise<{ id: string }>;

export default async function PropertyPage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;

  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    return <div className="p-4">Некорректный ID</div>;
  }

  // !!! Проверь имя таблицы. Здесь стоит 'BinaGE'.
  const { data, error } = await supabase
    .from('BinaGE')
    .select('*')
    .eq('id', numericId)
    .single();

  if (error || !data) {
    return <div className="p-4">Объявление не найдено</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">
        {data.title ?? `Объект #${data.id}`}
      </h1>
      <div className="text-sm opacity-80">{data.address}</div>
      <div className="text-lg">Цена: {data.price ?? '—'}</div>
      <div>Спальни: {data.bedrooms ?? '—'}</div>

      <pre className="text-xs bg-muted p-3 rounded-lg overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
