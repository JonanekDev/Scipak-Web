<script setup>
import AboutSection from '~/components/home/AboutSection.vue';
import HeroSection from '~/components/home/HeroSection.vue';
import ContactSection from '~/components/home/ContactSection.vue';
useHead({
  titleTemplate: '%s',
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Jonáš Ščipák',
        url: 'https://scipak.eu',
        jobTitle: 'Junior Sysadmin',
        knowsAbout: ['Proxmox', 'Linux', 'Docker', 'Networking'],
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Palacký University Olomouc',
          url: 'https://www.upol.cz/',
        },
        sameAs: [
          'https://github.com/JonanekDev/',
          'https://www.linkedin.com/in/jon%C3%A1%C5%A1-%C5%A1%C4%8Dip%C3%A1k-b5058522b/',
          'https://www.youtube.com/@scipakos',
          'https://www.instagram.com/jonasscipak/',
        ],
      }),
    },
  ],
});
useSeoMeta({
  title: $t('home.seo_title'),
  description: $t('home.seo_description'),
  ogTitle: $t('home.seo_title'),
  ogDescription: $t('home.seo_description'),
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
