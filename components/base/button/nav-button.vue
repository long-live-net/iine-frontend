<script setup lang="ts">
withDefaults(
  defineProps<{
    to: string
    width?: string
  }>(),
  {
    width: 'auto',
  }
)
</script>

<template>
  <nuxt-link :to="to" class="nav-button">
    <span class="caret" />
    <span><slot /></span>
  </nuxt-link>
</template>

<style lang="scss" scoped>
.nav-button {
  position: relative;
  display: inline-block;
  width: v-bind('width');
  color: var(--link-color);
  border: solid 1px var(--link-color);
  border-radius: 4px;
  padding: 6px 1rem;
  user-select: none;
  transition: all 0.3s;
  z-index: 0;

  .caret {
    position: absolute;
    top: 50%;
    right: 20px;
    width: 8px;
    height: 8px;
    border-top: 2px solid var(--link-color);
    border-right: 2px solid var(--link-color);
    transform: rotate(45deg) translateY(-50%);
    border-radius: 1px;
    transition: all 0.75s;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 0;
    display: inline-block;
    background-color: var(--link-color);
    transition: 0.3s;
  }

  &:hover {
    font-weight: bold;
    color: var(--link-text-color);
    // border-color: var(--link-active-color);

    .caret {
      width: 15px;
      height: 15px;
      border-width: 5px;
      border-color: var(--link-text-color);
    }

    &:before {
      width: 100%;
      z-index: -1;
    }
  }

  span {
    font-size: 0.9rem;
  }
}
</style>
