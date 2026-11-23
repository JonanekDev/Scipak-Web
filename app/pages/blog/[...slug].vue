<script setup>
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();

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

const { data: surround } = await useAsyncData(`surround-${collectionName}-${searchPath}`, () =>
  queryCollectionItemSurroundings(collectionName, searchPath, { fields: ['title'] }).order(
    'date',
    'DESC',
  ),
);
const [newer, older] = surround.value ?? [];

const words = (n) =>
  typeof n === 'string'
    ? n.split(/\s+/).filter(Boolean).length
    : Array.isArray(n)
      ? n.slice(2).reduce((a, c) => a + words(c), 0)
      : 0;
const readMinutes = Math.max(1, Math.round(words(article.value.body.value) / 200));
const toc = article.value.body.toc?.links ?? [];

const fullUrl = withSiteUrl(route.path);
const ogImageUrl = withSiteUrl(article.value.thumbnail);
const published = new Date(article.value.date).toISOString();
const modified = article.value.updated ? new Date(article.value.updated).toISOString() : published;
const { t } = useI18n();
const blogUrl = withSiteUrl(locale.value === 'cs' ? '/cs/blog' : '/blog');

useSeoMeta({
  ogSiteName: 'scipak.eu',
  title: article.value.title,
  description: article.value.description,
  ogTitle: article.value.title,
  ogDescription: article.value.description,
  ogImage: ogImageUrl,
  ogImageAlt: article.value.title,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  articlePublishedTime: published,
  articleModifiedTime: modified,
  articleTag: article.value.tags,
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.value.title,
        description: article.value.description,
        datePublished: new Date(article.value.date).toISOString(),
        dateModified: modified,
        inLanguage: locale.value,
        author: {
          '@type': 'Person',
          name: 'Jonáš Ščipák',
          url: withSiteUrl('/').value,
        },
        publisher: { '@type': 'Person', name: 'Jonáš Ščipák', url: withSiteUrl('/').value },
        image: ogImageUrl.value,
        mainEntityOfPage: fullUrl.value,
        url: fullUrl.value,
        keywords: article.value.tags?.join(', '),
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Blog', item: blogUrl.value },
          { '@type': 'ListItem', position: 2, name: article.value.title, item: fullUrl.value },
        ],
      }),
    },
  ],
});
</script>

<template>
  <article>
    <h1 class="title">{{ article.title }}</h1>
    <p class="post-meta mono">
      <time :datetime="article.date">
        {{
          new Date(article.date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        }}
      </time>
      · {{ $t('blog.min_read', { n: readMinutes }) }}
      <NuxtLink
        v-for="tag in article.tags"
        :key="tag"
        :to="{ path: localePath('/blog'), query: { tag } }"
        class="tag"
        >{{ tag }}</NuxtLink
      >
    </p>
    <div class="post-layout">
      <div class="post-main">
        <details v-if="toc.length" class="toc-mobile">
          <summary class="mono">{{ $t('blog.toc') }}</summary>
          <ArticleToc :links="toc" />
        </details>
        <div class="post">
          <ContentRenderer :value="article" />
        </div>
        <nav v-if="newer || older" class="post-nav">
          <NuxtLink v-if="older" :to="localePath(older.path)" class="prev"
            ><span class="mono">← {{ $t('blog.prev') }}</span
            >{{ older.title }}</NuxtLink
          >
          <NuxtLink v-if="newer" :to="localePath(newer.path)" class="next"
            ><span class="mono">{{ $t('blog.next') }} →</span>{{ newer.title }}</NuxtLink
          >
        </nav>
        <ContactBox />
      </div>
      <aside v-if="toc.length" class="toc-desktop">
        <p class="mono">{{ $t('blog.toc') }}</p>
        <ArticleToc :links="toc" />
      </aside>
    </div>
  </article>
</template>

<style>
.post-meta {
  font-size: 13px;
  color: var(--color-text-disabled);
  margin-bottom: var(--space-8);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.post-meta .tag {
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0 var(--space-2);
}

.post-meta .tag:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.post-layout {
  display: grid;
  gap: var(--space-12);
}

.post-main {
  min-width: 0;
}

.toc-desktop {
  display: none;
}

.toc-mobile {
  margin-bottom: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
}

.toc-mobile summary {
  cursor: pointer;
}

.toc-desktop ul,
.toc-mobile ul {
  list-style: none;
  font-size: 0.9rem;
}

.toc-desktop ul ul,
.toc-mobile ul ul {
  padding-left: var(--space-4);
}

.toc-desktop li,
.toc-mobile li {
  margin-top: var(--space-2);
}

.toc-desktop a,
.toc-mobile a {
  color: var(--color-text-muted);
}

.toc-desktop a:hover,
.toc-mobile a:hover {
  color: var(--color-primary);
}

.toc-desktop p {
  font-size: 0.85rem;
  color: var(--color-text-disabled);
  margin-bottom: 0;
}

@media (min-width: 1100px) {
  .post-layout {
    grid-template-columns: minmax(0, 860px) 240px;
    justify-content: space-between;
  }

  .toc-desktop {
    display: block;
    position: sticky;
    top: var(--space-16);
    align-self: start;
  }

  .toc-mobile {
    display: none;
  }
}

.post-nav {
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  margin-top: var(--space-12);
}

.post-nav a {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  max-width: 48%;
  color: var(--color-text);
}

.post-nav .next {
  margin-left: auto;
  text-align: right;
}

.post-nav span {
  font-size: 0.8rem;
  color: var(--color-text-disabled);
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
  color: var(--color-text);
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

.post h2::before {
  content: '// ';
  color: var(--color-text-disabled);
  font-family: 'DM Mono', monospace;
}

/* Text a seznamy */
.post p,
.post ul,
.post ol,
.post blockquote {
  max-width: 70ch;
}

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

/* Tabulky (obalené v ProseTable.vue) */
.post .table-wrap {
  margin: var(--space-6) 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.post .table-wrap:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.post table {
  width: 100%;
  min-width: 36rem; /* na úzkém displeji se tabulka posouvá, sloupce se nemačkají */
  border-collapse: separate;
  border-spacing: 0;
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
}
</style>
