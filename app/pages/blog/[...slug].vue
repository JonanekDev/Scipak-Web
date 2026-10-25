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
          name: 'Jonáš Ščipák',
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
.article {
  max-width: 820px;
  margin: 0 auto;
}

.post-date {
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  color: var(--color-text-disabled);
  display: block;
  margin-bottom: var(--space-4);
}

/* Nadpisy */
.post h2,
.post h3,
.post h4 {
  scroll-margin-top: var(--space-16);
}

.post h2 a,
.post h3 a,
.post h4 a {
  color: inherit;
}

.post h2 {
  font-size: 1.75rem;
  line-height: 1.3;
  font-weight: 700;
  color: var(--color-secondary);
  margin: var(--space-16) 0 var(--space-6);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}

.post h3 {
  font-size: 1.3rem;
  line-height: 1.4;
  font-weight: 700;
  color: var(--color-text);
  margin: var(--space-12) 0 var(--space-3);
}

.post h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-muted);
  margin: var(--space-8) 0 var(--space-2);
}

/* Text a seznamy */
.post p {
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.post ul,
.post ol {
  padding-left: var(--space-8);
  margin-bottom: var(--space-6);
  color: var(--color-text-muted);
}

.post li {
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: var(--space-2);
}

.post li::marker {
  color: var(--color-primary);
}

.post li > ul,
.post li > ol {
  margin-top: var(--space-2);
  margin-bottom: 0;
}

.post li p {
  font-size: inherit;
  margin-bottom: var(--space-2);
}

/* Odkazy v textu: podtržené, ať jsou poznat */
.post p a,
.post li a,
.post td a {
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-decoration-color: color-mix(in srgb, var(--color-primary) 50%, transparent);
}

.post p a:hover,
.post li a:hover,
.post td a:hover {
  text-decoration-color: currentColor;
}

/* Kód */
.post :not(pre) > code {
  font-family: 'DM Mono', monospace;
  font-size: 0.88em;
  color: var(--color-text);
  background: var(--color-bg-subtle);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.1em 0.4em;
  word-break: break-word;
}

.post pre {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-6);
  margin: var(--space-6) 0;
  overflow-x: auto;
}

.post pre code {
  font-family: 'DM Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text);
  background: none;
  border: 0;
  padding: 0;
}

/* Tabulky */
.post table {
  width: 100%;
  margin: var(--space-6) 0;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-size: 1rem;
}

.post th,
.post td {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  vertical-align: top;
  line-height: 1.5;
}

.post th {
  font-family: 'DM Mono', monospace;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-primary);
  background: var(--color-bg-subtle);
  border-bottom: 1px solid var(--color-border);
}

.post td {
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border-subtle);
}

.post tbody tr:nth-child(even) td {
  background: var(--color-bg-elevated);
}

.post tbody tr:last-child td {
  border-bottom: 0;
}

/* Obrázky: bez ořezu, ať jsou screenshoty celé */
.post img {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  margin: var(--space-6) 0;
}

/* Ostatní */
.post blockquote {
  margin: var(--space-6) 0;
  padding: var(--space-2) var(--space-6);
  border-left: 3px solid var(--color-primary);
  background: var(--color-primary-subtle);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.post blockquote p {
  margin-bottom: var(--space-2);
}

.post hr {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: var(--space-12) 0;
}

@media (max-width: 640px) {
  .post p,
  .post li {
    font-size: 1.0625rem;
  }

  .post h2 {
    font-size: 1.5rem;
  }

  /* široké tabulky se na mobilu posouvají do strany */
  .post table {
    display: block;
    overflow-x: auto;
  }
}
</style>
