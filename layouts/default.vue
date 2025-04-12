<script setup lang="ts">
defineOptions({
  name: 'DefaultLayout',
})

const { customerSetting } = useCustomerSetting()
const initializing = useState<boolean>('initializing', () => true)
onMounted(() => {
  if (initializing.value)
    setTimeout(() => {
      initializing.value = false
    }, 1000)
})

const topHashName = 'default-layout-main-top'
</script>

<template>
  <div id="default-layout">
    <div v-if="initializing" class="initializing">
      <div class="loading">loading ...</div>
    </div>
    <div v-show="!initializing" id="default-layout-container">
      <header>
        <PublishLayoutNavHeader />
      </header>
      <main :id="topHashName">
        <slot />
      </main>
      <footer>
        <PublishLayoutNavFooter />
      </footer>
    </div>
    <client-only>
      <CommonReservasionSideChip
        v-if="customerSetting?.reservationUrl"
        :reservation-url="customerSetting.reservationUrl"
      />
      <CommonTopToButton :top-hash-name="topHashName" />
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
      top: 0;
      width: 100%;
      z-index: 999;
    }

    main {
      flex-grow: 1;
      position: relative;
      padding-bottom: 6rem;

      @media only screen and (max-width: $grid-breakpoint-md) {
        padding-bottom: 9rem;
      }
    }

    footer {
      @media only screen and (max-width: $grid-breakpoint-md) {
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 999;
      }
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
