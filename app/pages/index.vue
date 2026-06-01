<script setup>
import HeroSection from '~/components/home/HeroSection.vue'
useSeoMeta({
  title: 'Home',
  description: 'IT student & junior sysadmin building infra',
  ogTitle: 'Jonas Ščipák',
  ogDescription: 'IT student & junior sysadmin building infra',
  ogImage: '/og-home.webp',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>
<template>
  <HeroSection />
</template>