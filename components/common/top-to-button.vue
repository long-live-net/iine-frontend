<script setup lang="ts">
defineProps<{
  topHashName: string
  src: string
}>()

const { windowHeight, scrollY } = useWindowState()
const isScrollOverTheWindow = computed(
  () => scrollY.value > windowHeight.value * 0.3
)
</script>

<template>
  <div
    class="top-to-button"
    :class="{ 'button-active': isScrollOverTheWindow }"
  >
    <nuxt-link class="top-to-button__avatar" :to="{ hash: `#${topHashName}` }">
      <v-avatar :image="src" size="72" />
    </nuxt-link>
  </div>
</template>

<style lang="scss" scoped>
.top-to-button {
  z-index: 10;
  position: fixed;
  right: 2rem;
  bottom: 3rem;
  text-align: center;
  transition: all 1s;
  transform: translateY(3rem);
  opacity: 0;
  visibility: hidden;
  &__avatar {
    width: 4rem;
    height: 4rem;
  }
  &::after {
    content: 'TOP';
    font-weight: bold;
    display: block;
    margin-top: 0.5rem;
  }

  @media only screen and (max-width: $grid-breakpoint-md) {
    right: 1rem;
    bottom: 1.8rem;
    &__avatar {
      width: 3rem;
      height: 3rem;
    }
    &::after {
      font-size: small;
    }
  }
}

.button-active {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}
</style>
