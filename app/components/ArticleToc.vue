<script setup>
defineProps({ links: { type: Array, required: true }, active: { type: String, default: '' } });
</script>

<template>
  <ul>
    <li v-for="l in links" :key="l.id">
      <a :href="`#${l.id}`" :class="{ active: l.id === active }">{{ l.text }}</a>
      <ArticleToc v-if="l.children?.length" :links="l.children" :active="active" />
    </li>
  </ul>
</template>
