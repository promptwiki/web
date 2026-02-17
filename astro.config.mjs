import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://promptwiki.dev', // 커스텀 도메인 연결 전: https://promptwiki.github.io/web
  output: 'static',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [tailwind(), mdx()],
});
