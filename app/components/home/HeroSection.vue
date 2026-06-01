<template>
<section id="hero">
    <div class="mono-comment">// sysadmin & IT student @ UP Olomouc</div>

    <i18n-t keypath="hero.title" tag="h1" class="hero-title">
      <template #homelab>
        <span class="text-primary mono-highlight">
          {{ $t('hero.homelab_word') }}
        </span>
      </template>
    </i18n-t>

    <div>
      <p class="hero-subtitle">
        {{ $t('hero.subtitle') }}
      </p>
      <i18n-t keypath="hero.learning_now" tag="p" class="hero-subtitle">
        <template #learning_now_list>
          <strong>
            {{ $t('hero.learning_now_list') }}
          </strong>
        </template>
      </i18n-t>
    </div>

    <ul class="tech-stack">
      <li>Proxmox HA</li>
      <li>Docker Swarm</li>
      <li>Ansible</li>
      <li>Traefik</li>
      <li>Linux</li>
      <li>WireGuard</li>
    </ul>

    <div class="cta-group">
      <NuxtLink to="/blog" class="btn-primary"> Explore my lab </NuxtLink>
    </div>
  </section>
</template>


<style scoped>
#hero {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-6);
  padding: var(--space-16) 0;
}

.mono-comment {
  font-family: 'DM Mono', monospace;
  color: var(--color-text-disabled);
}

.mono-highlight {
  font-family: 'DM Mono', monospace;
}

.text-primary {
  color: var(--color-primary);
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;

  max-width: 15ch;
  text-wrap: balance;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  line-height: 1.5;
  max-width: 600px;
}

.hero-subtitle strong {
  color: var(--color-accent);
  font-weight: 500;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  list-style: none;
  margin-top: var(--space-2);
}

.tech-stack li {
  font-family: 'DM Mono', monospace;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  transition: border-color var(--transition);
}

.tech-stack li:hover {
  border-color: var(--color-primary);
  color: var(--color-text);
}

.cta-group {
  margin-top: var(--space-6);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: #000000;
  font-weight: bold;
  font-family: 'DM Mono', monospace;
  text-decoration: none;
  padding: var(--space-3) var(--space-8);
  border-radius: var(--radius-md);
  transition:
    background-color var(--transition);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}
</style>
