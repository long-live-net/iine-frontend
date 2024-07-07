<script setup lang="ts">
const topButtonImage = '/images/arrow-up2.png'
</script>

<template>
  <div>
    <div id="home-index-top">
      <PublishHome />
    </div>
    <client-only>
      <CommonTopToButton :src="topButtonImage" />
    </client-only>
  </div>
</template>

<style scoped lang="scss">
#home-index-top {
  padding: 0;
  padding-bottom: 4rem;
}
</style>
