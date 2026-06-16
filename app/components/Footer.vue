<template>
  <footer>
    <div class="container hero-container">
      <p>&copy; {{ new Date().getFullYear() }} Jonáš Ščipák. Built with Nuxt and ❤️.</p>
      <div class="socials">
        <a href="mailto:jonas@scipak.eu" aria-label="Email">
          <Icon name="lucide:mail" class="icon" />
        </a>
        <a
          href="https://www.linkedin.com/in/jon%C3%A1%C5%A1-%C5%A1%C4%8Dip%C3%A1k-b5058522b/"
          target="_blank"
          rel="noopener"
          aria-label="LinkedIn"
        >
          <Icon name="lucide:linkedin" class="icon" />
        </a>
        <a href="https://github.com/JonanekDev/" target="_blank" rel="noopener" aria-label="GitHub">
          <Icon name="lucide:github" class="icon" />
        </a>
        <a
          href="https://www.youtube.com/@scipakos"
          target="_blank"
          rel="noopener"
          aria-label="YouTube"
        >
          <Icon name="lucide:youtube" class="icon" />
        </a>
        <a
          href="https://www.instagram.com/jonasscipak/"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
        >
          <Icon name="lucide:instagram" class="icon" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: var(--color-bg-elevated);
  padding: var(--space-8) var(--space-4);
  margin-top: auto;
}
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.socials {
  display: flex;
  gap: var(--space-4);
}
.icon {
  width: 24px;
  height: 24px;
  color: var(--color-text-muted);
  transition: color var(--transition);
}
.icon:hover {
  color: var(--color-primary);
}
</style>
