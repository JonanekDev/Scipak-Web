<script setup>
const route = useRoute();
const { locale } = useI18n();

const collectionName = locale.value === 'cs' ? 'blog_cs' : 'blog_en';

const searchPath = locale.value === 'cs' ? route.path.replace(/^\/cs/, '') : route.path;

const { data: article } = await useAsyncData(`blog-${collectionName}-${searchPath}`, () => {
  return queryCollection(collectionName).where('path', '=', searchPath).first();
});

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found',
  });
}

const fullUrl = withSiteUrl(route.path);
const ogImageUrl = withSiteUrl(article.value.thumbnail);

useSeoMeta({
  title: article.value.title,
  description: article.value.description,
  ogTitle: article.value.title,
  ogDescription: article.value.description,
  ogImage: ogImageUrl,
  ogType: 'article',
  ogUrl: fullUrl,
  ogLocale: locale.value === 'cs' ? 'cs_CZ' : 'en_US',
  twitterCard: 'summary_large_image',
  articlePublishedTime: new Date(article.value.date).toISOString(),
});

useHead({
  link: [{ rel: 'canonical', href: fullUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.value.title,
        description: article.value.description,
        datePublished: new Date(article.value.date).toISOString(),
        author: {
          '@type': 'Person',
          name: 'Jonáš Šípak',
          url: withSiteUrl('/').value,
        },
        image: ogImageUrl.value,
        mainEntityOfPage: fullUrl.value,
        url: fullUrl.value,
      }),
    },
  ],
});
</script>

<template>
  <article>
    <h1 class="title">{{ article.title }}</h1>
    <time class="post-date" :datetime="article.date">
      {{
        new Date(article.date).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }}
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
