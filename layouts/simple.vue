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
  <v-app class="g-theme-app-body">
    <main>
      <slot />
    </main>
  </v-app>
</template>
