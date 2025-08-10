'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Делает страницу полностью динамической (никаких пререндеров с фетчем на билде)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Property = {
  id: number;
  title?: string;
  price?: number;
  bedrooms?: number;
  address?: string;
  description?: string;
  images?: string[] | null;
};

// Берём **публичные** переменные (они должны прийти в бандл на этапе build)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export default function PropertyPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setErrorText(null);

        if (!supabase) {
          throw new Error(
            'SUPABASE env is missing. Проверь NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY.'
          );
        }

        const numericId = Number(params.id);
        if (Number.isNaN(numericId)) {
          throw new Error('Некорректный ID объявления');
        }

        // ⚠️ ЗАМЕНИ "BinaGE" на реальное имя таблицы
        const { data, error } = await supabase
          .from('BinaGE')
          .select('*')
          .eq('id', numericId)
          .single();

        if (error) throw error;
        setData(data as Property);
      } catch (e: any) {
        setErrorText(e?.message ?? 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params.id]);

  if (loading) return <div className="p-4">Загрузка…</div>;
  if (errorText) return <div className="p-4 text-red-600">Ошибка: {errorText}</div>;
  if (!data) return <div className="p-4">Объявление не найдено</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{data.title ?? `Объект #${data.id}`}</h1>
      <div className="text-sm opacity-80">{data.address}</div>
      <div className="text-lg">Цена: {data.price ?? '—'}</div>
      <div>Спальни: {data.bedrooms ?? '—'}</div>

      <pre className="text-xs bg-gray-100 p-3 rounded-lg overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
