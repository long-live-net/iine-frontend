<script setup lang="ts">
const headerTitle = {
  title: 'ロングリブネット',
  color: 'yellow',
  to: { name: 'index', hash: '#home-index-top' },
}

const { domidPrefix, homeSections } = useHomePageSections()
</script>

<template>
  <nav class="nav-header g-theme-header">
    <h2 class="nav-header__title">
      <nuxt-link :to="headerTitle.to">
        {{ headerTitle.title }}
      </nuxt-link>
    </h2>
    <div class="g-block-lg">
      <div class="nav-header__wide">
        <p
          v-for="section in homeSections"
          :key="section.order"
          class="menu-link"
        >
          <nuxt-link
            :to="{
              name: 'index',
              hash: `#${domidPrefix}-${section.kind}`,
            }"
          >
            {{ section.menuTitle ?? section.title }}
          </nuxt-link>
        </p>
      </div>
    </div>
    <div class="g-block-sm">
      <div>MENU NARROW</div>
      <!-- <customer-user-tools v-show="isAuthenticated" :with-name="false" />
        <b-button variant="light" @click="openSidebar">
          <b-icon
            icon="list"
            variant="dark"
            style="width: 1.5rem; height: 18px"
          />
        </b-button> -->
      <!-- <b-sidebar
        v-model="sidebar"
        bg-variant="dark"
        text-variant="light"
        shadow
        backdrop
      >
        <component :is="narrowMenuTemplateName" @close="closeSidebar" />
      </b-sidebar> -->
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav-header {
  height: $nav-header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  &__title {
    margin: 0;
    font-size: 1.3rem;
    :deep(a) {
      font-weight: 900;
      color: v-bind('headerTitle.color');
    }
    :deep(a:hover) {
      color: orange;
    }
  }
  &__wide {
    display: flex;
    align-items: center;
    .menu-link {
      margin: 0;
      font-weight: bold;
      font-size: 1rem;
      margin-right: 0.75rem;
      :deep(a) {
        font-weight: bold;
        color: white;
      }
      :deep(a:hover) {
        color: orange;
      }
    }
  }
}
</style>
