<template>
  <section id="about" class="container container-narrow">
    <h2 class="section-title">{{ $t('about.title') }}</h2>
    <i18n-t keypath="about.paragraph_1" tag="p"> </i18n-t>
    <i18n-t keypath="about.paragraph_2" tag="p">
      <template #strong>
        <strong>
          {{ $t('about.paragraph_2_strong') }}
        </strong>
      </template>
    </i18n-t>
    <i18n-t keypath="about.paragraph_3" tag="p">
      <template #strong>
        <strong>
          {{ $t('about.paragraph_3_strong') }}
        </strong>
      </template>
    </i18n-t>
  </section>
</template>

<style scoped>
/* Scoped styles removed as they are now global */
</style>
