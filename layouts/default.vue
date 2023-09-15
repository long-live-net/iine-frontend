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
  <v-app class="g-theme-app-body">
    <div id="application-body">
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
  </v-app>
</template>

<style lang="scss" scoped>
#application-body {
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
