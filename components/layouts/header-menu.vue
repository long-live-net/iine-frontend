<script setup lang="ts">
const sidebar = ref(false)
const openSidebar = () => {
  sidebar.value = true
}
const closeSidebar = () => {
  sidebar.value = false
}
</script>

<template>
  <nav class="header-menu g-theme-header">
    <div>
      <p>ロングリブネット</p>
      <!-- <component :is="titleTemplateName" /> -->
    </div>
    <div class="g-block-lg">
      <div>MENU WIDE</div>
      <!-- <component :is="wideMenuTemplateName" />
        <customer-user-tools v-show="isAuthenticated" class="ml-2" /> -->
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
.header-menu {
  height: $nav-header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  &__wide-menu {
    display: flex;
    align-items: center;
  }
}
</style>
