<script setup>
const email = 'jonas@scipak.eu';
const copied = ref(false);
async function copy() {
  await navigator.clipboard.writeText(email);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>

<template>
  <aside class="contact-box">
    <div>
      <h2 class="mono">{{ $t('contact.cta_title') }}</h2>
      <p>{{ $t('contact.cta_text') }}</p>
      <p class="address mono">
        {{ email }}
        <button
          type="button"
          :aria-label="$t('blog.copy')"
          :title="copied ? $t('blog.copied') : $t('blog.copy')"
          @click="copy"
        >
          <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" />
        </button>
      </p>
    </div>
    <div class="actions">
      <a class="btn-primary" href="mailto:jonas@scipak.eu">{{ $t('contact.cta_email') }}</a>
      <a
        class="btn-secondary"
        href="https://www.linkedin.com/in/jon%C3%A1%C5%A1-%C5%A1%C4%8Dip%C3%A1k-b5058522b/"
        target="_blank"
        rel="noopener"
        aria-label="LinkedIn"
        ><Icon name="lucide:linkedin"
      /></a>
    </div>
  </aside>
</template>

<style scoped>
.contact-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  margin-top: var(--space-16);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
}
h2 {
  font-size: 1.1rem;
  margin-bottom: var(--space-2);
}
h2::before {
  content: '// ';
  color: var(--color-text-disabled);
}
p {
  margin: 0;
  color: var(--color-text-muted);
  max-width: 50ch;
}
.address {
  margin-top: var(--space-3);
  font-size: 0.9rem;
  color: var(--color-text);
}
.address button {
  font: inherit;
  color: var(--color-text-muted);
  background: none;
  border: 0;
  cursor: pointer;
  vertical-align: middle;
}
.address button:hover {
  color: var(--color-primary);
}
.actions {
  display: flex;
  gap: var(--space-3);
}
</style>
