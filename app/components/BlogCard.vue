<script setup>
defineProps({ article: { type: Object, required: true } });
const localePath = useLocalePath();
</script>

<template>
  <NuxtLink :to="localePath(article.path)" class="article-item">
    <article class="article-card">
      <img
        v-if="article.thumbnail"
        :src="article.thumbnail"
        :alt="$t('blog.thumbnail_alt', { title: article.title })"
        class="article-thumbnail"
        loading="lazy"
        decoding="async"
      />
      <div class="article-content">
        <h3 class="article-title">{{ article.title }}</h3>
        <p class="article-description">{{ article.description }}</p>
      </div>
    </article>
  </NuxtLink>
</template>

<style scoped>
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
  aspect-ratio: 16 / 9;
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
