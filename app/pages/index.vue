<script setup>
import AboutSection from '~/components/home/AboutSection.vue';
import HeroSection from '~/components/home/HeroSection.vue';
import ContactSection from '~/components/home/ContactSection.vue';
useHead({
  titleTemplate: '%s',
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Jonáš Šípak',
      url: 'https://scipak.eu',
      jobTitle: 'Junior Sysadmin',
      knowsAbout: ['Proxmox', 'Linux', 'Docker', 'Networking'],
      sameAs: [
        'https://github.com/...',
        'https://linkedin.com/in/...',
      ]
    })
  }]
});
useSeoMeta({
  title: $t('home.seo_title'),
  description: 'IT student & junior sysadmin',
  ogTitle: 'Jonas Ščipák',
  ogDescription: 'IT student & junior sysadmin',
});
</script>
<template>
  <HeroSection />
  <AboutSection />
  <ContactSection />
</template>

<style>
h2.section-title {
  font-family: 'DM Mono', monospace;
  margin-bottom: var(--space-6);
}
h2.section-title::before {
  content: '// ';
  color: var(--color-text-disabled);
  font-family: 'DM Mono', monospace;
}
</style>
