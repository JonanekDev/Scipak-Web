<template>
  <section id="contact" class="container container-narrow">
    <h2 class="section-title">{{ $t('contact.title') }}</h2>
    <p>{{ $t('contact.paragraph') }}</p>
    <ul class="contact-list">
      <li>Email: <a href="mailto:jonas@scipak.eu">jonas@scipak.eu</a></li>
      <li>
        LinkedIn:
        <a
          href="https://www.linkedin.com/in/jon%C3%A1%C5%A1-%C5%A1%C4%8Dip%C3%A1k-b5058522b/"
          target="_blank"
          rel="noopener"
          >linkedin.com/in/jonáš-ščipák</a
        >
      </li>
    </ul>
  </section>
</template>

<style scoped>
.contact-list {
  list-style: none;
  padding-left: 0;
}
</style>
