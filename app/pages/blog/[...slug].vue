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
  twitterCard: 'summary_large_image',
});
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.value.title,
      description: article.value.description,
      datePublished: article.value.date,
      author: {
        '@type': 'Person',
        name: 'Jonáš Šípak',
        url: 'https://scipak.eu'
      },
      image: `https://scipak.eu${article.value.thumbnail}`,
      url: `https://scipak.eu${route.path}`,
    })
  }]
});
</script>

<template>
  <article>
    <h1 class="title">{{ article.title }}</h1>
    <time class="post-date" :datetime="article.date">
      {{ new Date(article.date).toLocaleDateString(locale, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) }}
    </time>
    <div class="post">
    <ContentRenderer :value="article" />
    </div>
  </article>
</template>

<style>

.post-date {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: var(--color-text-disabled);
  display: block;
  margin-bottom: var(--space-4);
}

.post h2 a {
  font-weight: 700;
  color: var(--color-secondary);
  margin: var(--space-12) 0 var(--space-4);
}

.post h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-muted);
  margin: var(--space-8) 0 var(--space-3);
}

.post p {
  font-size: 18px;
  line-height: 1.85;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.post ul,
.post ol {
  padding-left: var(--space-6);
  margin-bottom: var(--space-4);
  color: var(--color-text-muted);
}

.post li {
  font-size: 15px;
  line-height: 1.8;
  margin-bottom: var(--space-1);
}

.post li::marker {
  color: var(--color-primary);
}

.post img {
  width: 100%;
  max-width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  margin: var(--space-6) 0;
  display: block;
}
</style>