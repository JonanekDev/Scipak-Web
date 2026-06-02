<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const colorMode = useColorMode();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

// --- LOGIKA PRO JAZYKOVÝ DROPDOWN ---
const isLangMenuOpen = ref(false);
const dropdownRef = ref(null);

const toggleLangMenu = () => {
  isLangMenuOpen.value = !isLangMenuOpen.value;
};

const closeLangMenu = () => {
  isLangMenuOpen.value = false;
};

// --- LOGIKA PRO MOBILNÍ MENU ---
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

// Zavření dropdownu při kliknutí mimo něj
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isLangMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <header class="mono">
    <div class="container">
      <NuxtLink class="name" :to="localePath('/')">
        <span class="user">jonas</span>
        <span class="at">@</span>
        <span class="domain">scipak.eu </span>
      </NuxtLink>

      <nav :class="{ 'is-open': isMobileMenuOpen }">
        <ul>
          <li>
            <NuxtLink :to="{ path: localePath('/'), hash: '#about' }" @click="closeMobileMenu"
              >~/about</NuxtLink
            >
          </li>
          <li>
            <NuxtLink :to="{ path: localePath('/'), hash: '#projects' }" @click="closeMobileMenu"
              >~/projects</NuxtLink
            >
          </li>
          <li>
            <NuxtLink :to="{ path: localePath('/'), hash: '#contact' }" @click="closeMobileMenu"
              >~/contact</NuxtLink
            >
          </li>
          <li><NuxtLink :to="localePath('/blog')" @click="closeMobileMenu">~/blog</NuxtLink></li>
        </ul>
      </nav>

      <div class="right">
        <div class="lang-dropdown" ref="dropdownRef">
          <button
            @click="toggleLangMenu"
            class="lang-toggle"
            :class="{ 'is-active': isLangMenuOpen }"
            aria-label="Změnit jazyk"
          >
            {{ locale === 'cs' ? 'CS' : 'EN' }}
            <Icon name="lucide:chevron-down" class="chevron" />
          </button>

          <transition name="fade-down">
            <ul v-if="isLangMenuOpen" class="lang-menu">
              <li>
                <NuxtLink
                  :to="switchLocalePath('cs')"
                  @click="closeLangMenu"
                  :class="{ active: locale === 'cs' }"
                >
                  <span class="prompt" v-if="locale === 'cs'">> </span>Čeština
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="switchLocalePath('en')"
                  @click="closeLangMenu"
                  :class="{ active: locale === 'en' }"
                >
                  <span class="prompt" v-if="locale === 'en'">> </span>English
                </NuxtLink>
              </li>
            </ul>
          </transition>
        </div>

        <button @click="toggleTheme" class="theme-switch" aria-label="Přepnout motiv">
          <Icon v-if="colorMode.value === 'light'" name="lucide:moon" />
          <Icon v-else name="lucide:sun" />
        </button>
        <button @click="toggleMobileMenu" class="mobile-toggle" aria-label="Menu">
          <Icon v-if="isMobileMenuOpen" name="lucide:x" />
          <Icon v-else name="lucide:menu" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: var(--color-bg-elevated);
  position: relative;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-4);
}

nav ul {
  list-style: none;
  display: flex;
  gap: var(--space-6);
}

nav a {
  color: var(--color-text-muted);
  font-weight: 500;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0;
  transition: color var(--transition);
}

.mobile-toggle:hover {
  color: var(--color-primary);
}

nav a:hover {
  color: var(--color-primary);
}

.right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.lang-dropdown {
  position: relative;
}

.lang-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  font-family: inherit;
  font-weight: bold;
  font-size: 0.9rem;
  transition: color var(--transition);
  padding: 0;
}

.lang-toggle:hover,
.lang-toggle.is-active {
  color: var(--color-primary);
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform var(--transition);
}

.lang-toggle.is-active .chevron {
  transform: rotate(180deg);
}

.lang-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  list-style: none;
  padding: 8px 0;
  min-width: 120px;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.lang-menu a {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.lang-menu a:hover {
  color: var(--color-primary);
  background-color: rgba(0, 0, 0, 0.1);
}

.lang-menu a.active {
  color: var(--color-primary);
}

.prompt {
  color: var(--color-primary);
  margin-right: 6px;
  font-weight: bold;
}

.fade-down-enter-active,
.fade-down-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.theme-switch {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  transition: color var(--transition);
  padding: 0;
}

.theme-switch:hover {
  color: var(--color-primary);
}

.name {
  font-weight: bold;
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

@media (max-width: 768px) {
  /* Zobrazíme hamburger tlačítko */
  .mobile-toggle {
    display: flex;
    align-items: center;
  }

  /* Schováme klasické menu a připravíme ho na animaci */
  nav {
    position: absolute;
    top: 100%; /* Hned pod hlavičku */
    left: 0;
    right: 0;
    background-color: var(--color-bg-elevated);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-4);
    z-index: 40;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

    /* Animace vysunutí (nahrazuje display: none) */
    visibility: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition:
      opacity 0.2s ease,
      transform 0.2s ease,
      visibility 0.2s ease;
  }

  /* Když je menu aktivní, plynule ho zviditelníme a posuneme dolů */
  nav.is-open {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
  }

  /* Položky seřadíme pod sebe */
  nav ul {
    flex-direction: column;
    gap: var(--space-4);
  }

  /* Zvětšíme plochu pro kliknutí na mobilu (lepší UX) */
  nav a {
    display: block;
    padding: var(--space-2) 0;
    font-size: 1.1rem;
  }
}
</style>
