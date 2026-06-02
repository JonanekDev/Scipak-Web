<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const { locale } = useI18n();
const route = useRoute();

const { data: allArticles } = await useAsyncData('blog-list', () => {
  return queryCollection('blog').all();
});

const filteredArticles = computed(() => {
  if (!allArticles.value) return [];

  const groups = {};

  // Extracting locale and slug directly from the file path
  allArticles.value.forEach((article) => {
    const pathParts = article.path.split('/');
    const articleLocale = pathParts[1];
    const slug = pathParts[pathParts.length - 1];

    if (!groups[slug]) {
      groups[slug] = {};
    }

    groups[slug][articleLocale] = article;
  });

  const currentLang = locale.value;
  let result = [];

  // Fallback
  Object.values(groups).forEach((group) => {
    let selectedArticle = null;
    let isFallback = false;

    if (group[currentLang]) {
      selectedArticle = group[currentLang];
    } else if (group['en']) {
      selectedArticle = group['en'];
      isFallback = currentLang !== 'en';
    }

    if (selectedArticle) {
      // For default locale (en), remove the en/ prefix from path
      let articlePath = selectedArticle.path;
      if (currentLang === 'en' && articlePath.startsWith('/en/')) {
        articlePath = articlePath.replace('/en/', '/');
      }

      result.push({
        ...selectedArticle,
        path: articlePath,
        isFallback,
      });
    }
  });

  // Tag filtering
  const selectedTag = route.query.tag;
  if (selectedTag) {
    result = result.filter((article) => article.tags?.includes(selectedTag));
  }

  return result;
});
</script>

<template>
  <h1 class="title">{{ $t('blog.title') }}</h1>
  <div class="articles-list">
    <NuxtLink
      v-for="article in filteredArticles"
      :to="article.path"
      :key="article._id"
      class="article-item"
    >
      <article class="article-card">
        <img
          v-if="article.thumbnail"
          :src="article.thumbnail"
          :alt="`Thumbnail pro ${article.title}`"
          class="article-thumbnail"
        />
        <div class="article-content">
          <h2 class="article-title">{{ article.title }}</h2>
          <p class="article-description">{{ article.description }}</p>
        </div>
      </article>
    </NuxtLink>
  </div>
</template>

<style scoped>
.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

.article-item {
  text-decoration: none;
  color: inherit;
}

.article-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  overflow: hidden;
  transition: border-color var(--transition);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.article-card:hover {
  border-color: var(--color-primary);
}

.article-thumbnail {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
}

.article-content {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.article-title {
  font-size: 1rem;
  color: var(--color-text);
  margin: 0;
}

.article-description {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}
</style>
