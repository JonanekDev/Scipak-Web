<template>
  <section id="about" class="container">
    <h2 class="section-title">{{ $t('about.title') }}</h2>
    <div class="about-grid">
      <div class="about-text">
        <i18n-t keypath="about.paragraph_1" tag="p"> </i18n-t>
        <i18n-t keypath="about.paragraph_2" tag="p">
          <template #strong>
            <strong>
              {{ $t('about.paragraph_2_strong') }}
            </strong>
          </template>
        </i18n-t>
        <i18n-t keypath="about.paragraph_work" tag="p">
          <template #company>
            <a href="https://batlify.com" target="_blank" rel="noopener">Batlify</a>
          </template>
        </i18n-t>
        <i18n-t keypath="about.paragraph_3" tag="p">
          <template #strong>
            <strong>
              {{ $t('about.paragraph_3_strong') }}
            </strong>
          </template>
        </i18n-t>
      </div>
      <div class="terminal mono">
        <div><span class="prompt">$</span> whoami</div>
        <dl>
          <dt>role</dt>
          <dd>
            network engineer @
            <a href="https://batlify.com" target="_blank" rel="noopener">Batlify.com</a>
          </dd>
          <dt>work</dt>
          <dd>Kubernetes, GitOps, BGP</dd>
          <dt>study</dt>
          <dd>IT @ UP Olomouc</dd>
          <dt>homelab</dt>
          <dd>Proxmox, OpenWRT, Docker, Tailscale</dd>
          <dt>built</dt>
          <dd>Proxmox HA cluster, Hyper-V HA cluster</dd>
          <dt>status</dt>
          <dd><span class="dot">●</span> {{ $t('about.status') }}</dd>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-grid {
  display: grid;
  gap: var(--space-6);
  align-items: start;
}
@media (min-width: 960px) {
  .about-grid {
    grid-template-columns: minmax(0, 70ch) max-content;
    justify-content: space-between;
  }
}
.about-text > p {
  max-width: 70ch;
}
.terminal {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4) var(--space-6);
  font-size: 0.9rem;
  overflow-x: auto;
}
.prompt,
.dot {
  color: var(--color-primary);
}
dl {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--space-1) var(--space-6);
  margin-top: var(--space-2);
}
dt {
  color: var(--color-secondary);
}
dd {
  color: var(--color-text);
}
</style>
