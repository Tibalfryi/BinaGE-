/** @type {import('next').NextConfig} */
const nextConfig = {
  // Проталкиваем публичные переменные на клиент
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // На всякий случай выключаем static export — у нас SSR на Firebase
  output: undefined,
  reactStrictMode: true,
};

module.exports = nextConfig;
