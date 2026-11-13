<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { locale } = useI18n();

const { data: articles } = await useAsyncData(
  'blog-list',
  () =>
    queryCollection(locale.value === 'cs' ? 'blog_cs' : 'blog_en')
      .order('date', 'DESC')
      .all(),
  { watch: [locale] },
);

const filteredArticles = computed(() => {
  const selectedTag = route.query.tag;
  const all = articles.value ?? [];
  return selectedTag ? all.filter((article) => article.tags?.includes(selectedTag)) : all;
});
</script>

<template>
  <h1 class="title">{{ $t('blog.title') }}</h1>
  <div class="articles-list">
    <BlogCard v-for="article in filteredArticles" :key="article.path" :article="article" />
  </div>
</template>
