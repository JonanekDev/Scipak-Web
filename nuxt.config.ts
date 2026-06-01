// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
        { name: 'description', content: "IT student & junior sysadmin" },
        { name: 'author', content: 'Jonáš Ščipák' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    }
  },

  modules: ['@nuxt/content', '@nuxtjs/i18n', '@nuxtjs/seo', '@nuxt/icon', '@nuxtjs/color-mode'],
});
