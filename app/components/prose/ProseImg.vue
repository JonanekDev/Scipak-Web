<script setup>
defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  width: { type: [String, Number], default: undefined },
  height: { type: [String, Number], default: undefined },
});
const dialog = ref(null);
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    loading="lazy"
    decoding="async"
    class="zoomable"
    @click="dialog.showModal()"
  />
  <dialog ref="dialog" class="lightbox" @click="dialog.close()">
    <img :src="src" :alt="alt" />
  </dialog>
</template>

<style>
img.zoomable {
  cursor: zoom-in;
}
dialog.lightbox {
  margin: auto;
  padding: 0;
  border: 0;
  background: none;
  max-width: 95vw;
  max-height: 95vh;
  cursor: zoom-out;
}
dialog.lightbox::backdrop {
  background: rgb(0 0 0 / 0.85);
}
dialog.lightbox img {
  display: block;
  max-width: 95vw;
  max-height: 95vh;
  margin: 0;
}
</style>
