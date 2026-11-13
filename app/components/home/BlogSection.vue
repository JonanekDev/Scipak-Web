<script setup>
const { locale } = useI18n();
const localePath = useLocalePath();

const { data: articles } = await useAsyncData(
  'home-blog',
  () =>
    queryCollection(locale.value === 'cs' ? 'blog_cs' : 'blog_en')
      .order('date', 'DESC')
      .limit(3)
      .all(),
  { watch: [locale] },
);
</script>

<template>
  <section v-if="articles?.length" id="blog" class="container container-narrow">
    <h2 class="section-title">{{ $t('blog.latest') }}</h2>
    <div class="articles-list">
      <BlogCard v-for="article in articles" :key="article.path" :article="article" />
    </div>
    <NuxtLink :to="localePath('/blog')" class="all-posts mono">{{ $t('blog.all_posts') }} →</NuxtLink>
  </section>
</template>

<style scoped>
section {
  padding-block: var(--space-8);
}
.all-posts {
  display: inline-block;
  margin-top: var(--space-6);
  color: var(--color-primary);
  font-weight: bold;
}
</style>
