<script setup lang="ts">
defineOptions({
  name: 'DefaultLayout',
})

const initializing = useState<boolean>('initializing', () => true)
onMounted(() => {
  if (initializing.value)
    setTimeout(() => {
      initializing.value = false
    }, 1000)
})

const topButtonImage = '/images/arrow-up2.png'
const topHashName = 'default-layout-main-top'
</script>

<template>
  <div id="default-layout">
    <div v-if="initializing" class="initializing">
      <div class="loading">loading ...</div>
    </div>
    <div v-show="!initializing" id="default-layout-container">
      <header>
        <PublishMenuNavHeader />
      </header>
      <main :id="topHashName">
        <slot />
      </main>
      <footer>
        <PublishMenuNavFooter />
      </footer>
    </div>
    <client-only>
      <CommonTopToButton :top-hash-name="topHashName" :src="topButtonImage" />
    </client-only>
  </div>
</template>

<style lang="scss" scoped>
#default-layout {
  #default-layout-container {
    min-height: 100dvh;
    display: flex;
    flex-flow: column;
    align-items: stretch;

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

  .initializing {
    min-height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;

    .loading {
      // TODO:
      // 取り急ぎアニメーションは適当なので後日かっこいいものに変更したい
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
}
</style>
