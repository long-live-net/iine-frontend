<script setup lang="ts">
defineOptions({
  name: 'DefaultLayout',
})

const { headInfoRef } = useCustomerPageHeadInfo()
useHead({
  title: headInfoRef.value.title,
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: headInfoRef.value.description,
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: `/${headInfoRef.value.favicon}`,
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
  min-height: 100dvh;
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
