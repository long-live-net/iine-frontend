<script setup>
defineOptions({
  name: 'SimpleLayout',
})

const bodyClass = 'g-theme-default'
useHead({
  bodyAttrs: {
    class: bodyClass,
  },
})
</script>

<template>
  <main>
    <slot />
  </main>
</template>
