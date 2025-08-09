/** @type {import('next').NextConfig} */
const nextConfig = {
  // Никакого output: 'export'!
  reactStrictMode: true,

  // Если используешь next/image с внешними картинками — раскомментируй и настрой
  // images: {
  //   remotePatterns: [
  //     { protocol: 'https', hostname: '**' }
  //   ]
  // },

  experimental: {
    // оставим пусто/по умолчанию
  },
};

module.exports = nextConfig;
