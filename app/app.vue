<script setup>
console.log("Hi, I'm Jonáš :) I really love Windows server :)");

const i18nHead = useLocaleHead({
  dir: true,
  lang: true,
  seo: true,
});

useHead(() => ({
  htmlAttrs: i18nHead.value.htmlAttrs,
  link: i18nHead.value.link,
  meta: i18nHead.value.meta,
}));
</script>
<template>
  <Header />
  <main class="container">
    <NuxtPage />
  </main>
  <Footer />
</template>
