<script setup lang="ts">
defineOptions({
  name: 'DefaultLayout',
})

const { headInfo } = usePageHeadInfo()
useHead({
  title: headInfo.title,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: headInfo.description,
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: `/${headInfo.favicon}`,
    },
  ],
})
</script>

<template>
  <div id="default-layout-container">
    <header>
      <PublishMenuNavHeader />
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <PublishMenuNavFooter />
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
    z-index: 999;
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
