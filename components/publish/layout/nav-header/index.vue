<script setup lang="ts">
const { isLoggedIn } = useCustomerPageContext()
const { customer } = useCustomer()
const { domidPrefix, customerSetting } = useCustomerSetting()
const sidebar = ref(false)

const headerTitle = computed(() => ({
  title:
    customerSetting.value?.pageTitle?.title ??
    customer.value?.name ??
    'ページタイトル',
  color: 'yellow',
  hoverColor: 'orange',
  to: { name: 'index', hash: '#home-index-top' },
}))
const headerItems = computed(
  () =>
    customerSetting.value?.homeLayout?.map((s) => ({
      kind: s.kind,
      title: s.title,
      menuTitle: s.menuTitle,
      color: 'white',
      hoverColor: 'orange',
      to: {
        name: 'index',
        hash: `#${domidPrefix}-${s.kind}`,
      },
    })) ?? []
)
</script>

<template>
  <nav class="nav-header g-theme-header">
    <div class="g-block-lg">
      <div class="nav-header__menu">
        <PublishLayoutNavHeaderTitle
          :link-to="headerTitle.to"
          :title="headerTitle.title"
          :color="headerTitle.color"
          :hover-color="headerTitle.hoverColor"
        />
        <div class="row-direction">
          <PublishLayoutNavHeaderItem
            :link-to="{ name: 'index', hash: '#home-index-top' }"
            color="white"
            hover-color="orange"
          >
            <v-icon icon="mdi-home" size="large" style="padding-bottom: 2px" />
          </PublishLayoutNavHeaderItem>
          <PublishLayoutNavHeaderItem
            v-for="item in headerItems"
            :key="item.kind"
            :link-to="item.to"
            :title="item.menuTitle ?? item.title"
            :color="item.color"
            :hover-color="item.hoverColor"
          />
          <ClientOnly>
            <ManageCustomerUserMenu v-if="isLoggedIn" />
          </ClientOnly>
        </div>
      </div>
    </div>
    <div class="g-block-sm">
      <div class="nav-header__menu">
        <div class="nav-header__menu--title">
          <v-btn
            variant="text"
            icon="mdi-menu"
            color="white"
            @click="sidebar = !sidebar"
          />
          <PublishLayoutNavHeaderTitle
            :title="headerTitle.title"
            color="white"
            hover-color="white"
            @click="sidebar = !sidebar"
          />
        </div>
        <div>
          <ClientOnly>
            <ManageCustomerUserMenu v-if="isLoggedIn" />
          </ClientOnly>
        </div>
      </div>
      <ClientOnly>
        <teleport to="#default-layout-container">
          <BaseDrawer v-model:drawer="sidebar" color="#424242" theme="dark">
            <div class="column-direction">
              <PublishLayoutNavHeaderTitle
                :link-to="headerTitle.to"
                :title="headerTitle.title"
                :color="headerTitle.color"
                :hover-color="headerTitle.hoverColor"
              />
              <PublishLayoutNavHeaderItem
                v-for="item in headerItems"
                :key="item.kind"
                :link-to="item.to"
                :title="item.menuTitle ?? item.title"
                :color="item.color"
                :hover-color="item.hoverColor"
              />
              <div v-if="customerSetting?.reservationUrl">
                <CommonReservationChip
                  :url="customerSetting.reservationUrl"
                  class="reservation-button"
                  >予約する</CommonReservationChip
                >
              </div>
            </div>
          </BaseDrawer>
        </teleport>
      </ClientOnly>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav-header {
  .g-block-lg {
    padding: 0 1.8rem;
  }
  .g-block-sm {
    padding: 0 0.6rem 0 0;
  }
  &__menu {
    height: $nav-header-height;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &--title {
      display: flex;
      align-items: center;
    }
  }
}

.row-direction {
  display: flex;
  align-items: center;
  column-gap: 14px;
}

.column-direction {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  p:first-child {
    margin-top: 0.5rem;
  }
}

.reservation-button {
  width: 200px;
  padding: 6px 0;
  margin-top: 1rem;
}
</style>
