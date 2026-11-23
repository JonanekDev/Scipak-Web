<script setup>
const props = defineProps({
  code: { type: String, default: '' },
  language: { type: String, default: null },
  filename: { type: String, default: null },
  class: { type: String, default: null },
});
const { t } = useI18n();
const copied = ref(false);
const label = computed(
  () =>
    props.filename || (['text', 'plaintext', 'txt'].includes(props.language) ? '' : props.language),
);

async function copy() {
  await navigator.clipboard.writeText(props.code);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <div class="code-block">
    <div class="code-head mono">
      <span>{{ label }}</span>
      <button type="button" @click="copy">{{ copied ? t('blog.copied') : t('blog.copy') }}</button>
    </div>
    <pre :class="$props.class"><slot /></pre>
  </div>
</template>

<style scoped>
.code-block {
  margin: var(--space-6) 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg-elevated);
  overflow: hidden;
}
.code-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-1) var(--space-4);
  font-size: 0.8rem;
  color: var(--color-text-disabled);
  border-bottom: 1px solid var(--color-border);
}
.code-head button {
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  cursor: pointer;
}
.code-head button:hover {
  color: var(--color-primary);
}
.code-block pre {
  margin: 0;
  border: 0;
  border-radius: 0;
}
</style>
