<script setup lang="ts">
defineOptions({
  name: 'DefaultLayout',
})
</script>

<template>
  <div id="default-layout-container">
    <header>
      <ScreenMenuNavHeader />
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <ScreenMenuNavFooter />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
#default-layout-container {
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
