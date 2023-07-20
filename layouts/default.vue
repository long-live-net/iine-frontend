<script setup>
defineOptions({
  name: 'DefaultLayout',
})

const bodyClass = 'g-theme-default'
useHead({
  bodyAttrs: {
    class: bodyClass,
  },
})
</script>

<template>
  <div id="application-base-body">
    <header>
      <LayoutsHeaderMenu />
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
#application-base-body {
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  header {
    position: fixed;
    top: 0px;
    width: 100%;
    z-index: 99;
  }
  main {
    flex-grow: 1;
    position: relative;
    margin: 0;
    padding: 0;
  }
  footer {
    padding: 0;
    margin: 0;
  }
}
</style>
