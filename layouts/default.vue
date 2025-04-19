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
    <PublishLayoutAppLoading v-if="initializing" />
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
}
</style>
