<script setup>
const route = useRoute();
const { locale } = useI18n();

// Normalize route path
const normalizedPath = route.path.startsWith('/') ? route.path.slice(1) : route.path;

// If it's default locale (en) without prefix, add en/ to search path
let searchPath = `/${normalizedPath}`;
if (locale.value === 'en' && !normalizedPath.startsWith('en/')) {
  searchPath = `/en/${normalizedPath}`;
}

console.log('Search path:', searchPath);

const { data: article } = await useAsyncData(`blog-${route.path}`, () => {
  return queryCollection('blog').where('path', '=', searchPath).first();
});

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found',
  });
}

useSeoMeta({
  title: article.value.title,
  description: article.value.description,
  ogTitle: article.value.title,
  ogDescription: article.value.description,
  ogImage: article.value.thumbnail,
  ogType: 'article',
});
</script>

<template>
  <article>
    <h1 class="title">{{ article.title }}</h1>
    <ContentRenderer :value="article" />
  </article>
</template>
