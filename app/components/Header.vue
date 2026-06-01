<script setup>
const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};
</script>
<template>
  <header>
    <div class="container">
      <a class="name" href="/">
        <span class="user">jonas</span>
        <span class="at">@</span>
        <span class="domain">scipak.eu </span>
      </a>
      <nav>
        <ul>
          <li><a href="#about">~/about</a></li>
          <li><a href="#projects">~/projects</a></li>
          <li><a href="#contact">~/contact</a></li>
          <li><a href="/blog">~/blog</a></li>
        </ul>
      </nav>
      <div class="right">
        <button @click="toggleTheme">
          <Icon v-if="colorMode.value === 'light'" name="lucide:moon" />
          <Icon v-else name="lucide:sun" />
        </button>
      </div>
    </div>
  </header>
</template>

<style lang="css" scoped>
header {
  background-color: var(--color-bg-elevated);
  font-family: 'DM Mono', monospace;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) 0;
}

nav ul {
  list-style: none;
  display: flex;
  gap: var(--space-6);
}
nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition);
}
nav a:hover {
  color: var(--color-primary);
}
button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
}
button:hover {
  color: var(--color-primary);
}
.name {
  font-weight: bold;
  text-decoration: none;
}
.user {
  color: var(--color-text);
}
.at {
  color: var(--color-text-disabled);
}
.domain {
  color: var(--color-primary);
}
</style>
