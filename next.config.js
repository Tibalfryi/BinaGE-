/** @type {import('next').NextConfig} */
const nextConfig = {
  // Включаем новый режим статического экспорта (замена старому `next export`)
  output: 'export',

  // Если используешь <Image>, без оптимизатора на статике лучше выключить оптимизацию
  images: {
    unoptimized: true,
  },

  // (не обязательно) Если нужны конечные слеши в путях
  // trailingSlash: true,
};

module.exports = nextConfig;
