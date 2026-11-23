<template>
  <section id="projects" class="container">
    <h2 class="section-title">{{ $t('projects.title') }}</h2>
    <div class="project">
      <div class="project-text">
        <h3 class="mono">chart-monitor</h3>
        <p>{{ $t('projects.chart_monitor.description') }}</p>
        <ul>
          <li v-for="i in 3" :key="i">{{ $t(`projects.chart_monitor.feature_${i}`) }}</li>
        </ul>
        <a
          class="btn-secondary"
          href="https://github.com/JonanekDev/chart-monitor"
          target="_blank"
          rel="noopener"
        >
          <Icon name="lucide:github" /> GitHub
        </a>
      </div>
      <figure class="window">
        <div class="window-bar mono">
          <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          <span class="window-title">chart-monitor</span>
        </div>
        <ProseImg
          src="/imgs/home/chart-monitor.webp"
          width="2336"
          height="1402"
          :alt="$t('projects.chart_monitor.alt')"
        />
      </figure>
    </div>
  </section>
</template>

<style scoped>
section {
  padding-block: var(--space-8);
}
.project {
  display: grid;
  gap: var(--space-8);
  align-items: center;
}
@media (min-width: 960px) {
  .project {
    grid-template-columns: minmax(0, 40ch) minmax(0, 1fr);
    gap: var(--space-12);
  }
}
h3 {
  font-size: 1.25rem;
  margin-bottom: var(--space-3);
}
ul {
  list-style: none;
  margin-bottom: var(--space-6);
  color: var(--color-text-muted);
}
li::before {
  content: '✓ ';
  color: var(--color-primary);
}
.btn-secondary {
  gap: var(--space-2);
}
.window {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-elevated);
  overflow: hidden;
}
.window-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.8rem;
  color: var(--color-text-disabled);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-border);
}
.window-title {
  margin-left: var(--space-2);
}
.window :deep(img.zoomable) {
  display: block;
  width: 100%;
  height: auto;
  mask-image: linear-gradient(to bottom, black 85%, transparent);
}
</style>
