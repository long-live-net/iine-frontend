<script setup lang="ts">
import type { HeaderTitle } from '@/components/screen/menu/nav-header/title.vue'
import type { HeaderItem } from '@/components/screen/menu/nav-header/item.vue'

const { logout } = useAuth()
const { customerId, user, isLoggedIn, isPreview, togglePreview } =
  useFoundation()

const sidebar = ref(false)

// Todo: 適当
const headerTitle: HeaderTitle = {
  title: 'ロングリブネット',
  color: 'yellow',
  hoverColor: 'orange',
  to: { name: 'index', hash: '#home-index-top' },
}

const { domidPrefix, homeSections, fetchHomeLayout } =
  useHomeLayoutRead(customerId)
const headerItems = computed<HeaderItem[]>(
  () =>
    homeSections.value?.map((s) => ({
      ...s,
      color: 'white',
      hoverColor: 'orange',
      to: {
        name: 'index',
        hash: `#${domidPrefix}-${s.kind}`,
      },
    })) ?? []
)

const logoutDialog = ref(false)
const onLogout = () => {
  logoutDialog.value = false
  logout()
}

homeSections.value ?? (await fetchHomeLayout())
</script>

<template>
  <nav class="nav-header g-theme-header">
    <div class="g-block-lg">
      <div class="nav-header__menu">
        <ScreenMenuNavHeaderTitle :headerTitle="headerTitle" />
        <div class="row-direction">
          <ScreenMenuNavHeaderItem
            v-for="item in headerItems"
            :key="item.id"
            :menu-item="item"
          />
          <ClientOnly>
            <ScreenMenuNavHeaderUserMenu
              v-if="isLoggedIn"
              :user="user"
              @logout="logoutDialog = true"
              @preview="togglePreview"
            />
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
          <ScreenMenuNavHeaderTitle
            :headerTitle="{ ...headerTitle, color: 'white' }"
          />
        </div>
        <div>
          <ClientOnly>
            <ScreenMenuNavHeaderUserMenu
              v-if="isLoggedIn"
              :user="user"
              @logout="logoutDialog = true"
              @preview="togglePreview"
            />
          </ClientOnly>
        </div>
      </div>
      <ClientOnly>
        <teleport to="#application-body">
          <BaseDrawer v-model:drawer="sidebar" color="#424242" theme="dark">
            <div class="column-direction">
              <ScreenMenuNavHeaderTitle :headerTitle="headerTitle" />
              <ScreenMenuNavHeaderItem
                v-for="item in headerItems"
                :key="item.id"
                :menu-item="item"
              />
            </div>
          </BaseDrawer>
        </teleport>
      </ClientOnly>
    </div>
    <BaseConfirm
      v-model:comfirm="logoutDialog"
      message="本当にログアウトしますか？"
      exec-text="ログアウト"
      @cancel="logoutDialog = false"
      @confirm="onLogout"
    />
    <ScreenMenuOnPreview
      v-if="isPreview"
      class="nav-header__on-preview"
      @click="togglePreview"
    />
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
  &__on-preview {
    position: fixed;
    top: calc($nav-header-height + 0.75rem);
    right: 1rem;
  }
}

.row-direction {
  display: flex;
  align-items: center;
  column-gap: 1rem;
}
.column-direction {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  p:first-child {
    margin-top: 0.5rem;
  }
}
</style>
