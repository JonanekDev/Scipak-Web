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
    <i18n-t keypath="about.paragraph_work" tag="p">
      <template #company>
        <a href="https://batlify.com" target="_blank" rel="noopener">Batlify</a>
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
