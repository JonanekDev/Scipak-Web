// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  css: ['@/assets/css/main.css'],

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'cs', name: 'Čeština', file: 'cs.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    dataValue: 'theme',
    classSuffix: '',
  },

  app: {
    head: {
      titleTemplate: '%s - Jonáš Ščipák',
      meta: [
        { name: 'author', content: 'Jonáš Ščipák' },
        { name: 'theme-color', content: '#1caf87' },
        { name: 'twitter:card', content: 'summary' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Jonáš Ščipák' },
        { property: 'og:image', content: 'https://scipak.eu/favicon.webp' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/webp', sizes: '512x512', href: '/favicon.webp' },
      ],
    },
  },

  //Blog
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
  ],
});
