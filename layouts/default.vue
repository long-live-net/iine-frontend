<script setup lang="ts">
defineOptions({
  name: 'DefaultLayout',
})

const { customer } = useFoundation()
const bodyClass = ref('g-theme-default')

watch(
  customer,
  () => {
    if (customer.value?.colorTheme === 'dark') {
      bodyClass.value = 'g-theme-dark'
    } else {
      bodyClass.value = 'g-theme-default'
    }
  },
  {
    immediate: true,
  }
)
watch(
  bodyClass,
  () => {
    useHead({
      bodyAttrs: {
        class: bodyClass.value,
      },
    })
  },
  {
    immediate: true,
  }
)
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
