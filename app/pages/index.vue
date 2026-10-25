<script setup>
import AboutSection from '~/components/home/AboutSection.vue';
import HeroSection from '~/components/home/HeroSection.vue';
import ContactSection from '~/components/home/ContactSection.vue';

const { t } = useI18n();

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
        knowsAbout: ['Proxmox', 'Linux', 'Docker', 'Networking', 'Kubernetes', 'Homelab', 'Windows', 'Hyper-V', 'Clustering', 'Virtualization', 'Servers'],
        affiliation: {
          '@type': 'CollegeOrUniversity',
          name: 'Palacký University Olomouc',
          url: 'https://www.upol.cz/',
          department: {
            '@type': 'EducationalOrganization',
            name: 'Faculty of Science, Department of Computer Science',
            url: 'https://www.inf.upol.cz/',
          },
        },
        sameAs: [
          'https://github.com/JonanekDev/',
          'https://www.linkedin.com/in/jon%C3%A1%C5%A1-%C5%A1%C4%8Dip%C3%A1k-b5058522b/',
          'https://www.youtube.com/@scipakos',
          'https://www.instagram.com/jonasscipak/',
        ],
        alternateName: 'Jonas Scipak'
      }),
    },
  ],
});
useSeoMeta({
  title: () => t('home.seo_title'),
  description: () => t('home.seo_description'),
  ogTitle: () => t('home.seo_title'),
  ogDescription: () => t('home.seo_description'),
  ogType: 'website',
  ogImage: 'https://scipak.eu/imgs/og-cover.png',
  ogImageType: 'image/png',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterImage: 'https://scipak.eu/imgs/og-cover.png',
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
