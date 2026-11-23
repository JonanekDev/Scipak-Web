<script setup>
defineProps({ links: { type: Array, required: true } });
</script>

<template>
  <ul>
    <li v-for="l in links" :key="l.id">
      <a :href="`#${l.id}`">{{ l.text }}</a>
      <ArticleToc v-if="l.children?.length" :links="l.children" />
    </li>
  </ul>
</template>
