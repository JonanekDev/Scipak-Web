<template>
  <section id="hero">
    <div class="hero-content">
      <div class="hero-text">
        <div class="mono-comment">// sysadmin & IT student @ UP Olomouc</div>

        <i18n-t keypath="hero.title" tag="h1" class="hero-title">
          <template #homelab>
            <span class="text-primary mono">
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
      </div>

      <div class="hero-image-wrapper">
        <img src="/imgs/home/me.webp" class="hero-image" alt="Jonáš Ščipák - photo" fetchpriority="high" />
      </div>
    </div>
  </section>
</template>

<style scoped>
#hero {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-16) 0;
  flex-wrap: wrap;
}

.hero-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}
.hero-image-wrapper {
  position: relative;
  max-width: 500px;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.hero-image-wrapper::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 400px;
  background-color: var(--color-primary);
  filter: blur(80px);
  opacity: 0.25;
  z-index: 0;
  border-radius: 50%;
}

.hero-image {
  width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0) 100%);
  position: relative;
  z-index: 1;
  aspect-ratio: 1 / 1;
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

@media (max-width: 959px) {
  .hero-image-wrapper {
    display: none;
  }
}
</style>
