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

const initializing = useState<boolean>('initializing', () => true)
onMounted(() => {
  if (initializing.value)
    setTimeout(() => {
      initializing.value = false
    }, 300)
})
</script>

<template>
  <div id="default-layout-container">
    <div v-if="initializing" class="initializing">loading ...</div>
    <div v-show="!initializing">
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

  .initializing {
    // TODO:
    // 取り急ぎアニメーションは適当なので後日かっこいいものに変更したい
    margin: auto;
    font-family: sans-serif;
    font-size: 3rem;
    font-weight: bold;
    animation: ini-scaleout 1.5s infinite linear;

    @media only screen and (max-width: $grid-breakpoint-md) {
      font-size: 2rem;
    }
  }

  @keyframes ini-scaleout {
    0% {
      transform: scale(0.25);
    }
    100% {
      transform: scale(1);
      opacity: 0.25;
    }
  }
}
</style>
