<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { locale } = useI18n();

const { data: articles } = await useAsyncData(
  'blog-list',
  () => queryCollection(locale.value === 'cs' ? 'blog_cs' : 'blog_en').all(),
  { watch: [locale] },
);

const filteredArticles = computed(() => {
  if (!articles.value) return [];

  let result = articles.value.map((article) => ({
    ...article,
    path: locale.value === 'cs' ? `/cs${article.path}` : article.path,
  }));

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
