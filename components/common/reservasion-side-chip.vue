<script setup lang="ts">
const props = defineProps<{ reservationUrl: string | null }>()

const onClickLink = () => {
  if (import.meta.client) {
    if (props.reservationUrl) {
      window.open(props.reservationUrl, '_blank')
    }
  }
}
</script>

<template>
  <div class="reservation-button" @click="onClickLink"></div>
</template>

<style lang="scss" scoped>
.reservation-button {
  z-index: 1001;
  position: fixed;
  top: calc(50% + $nav-header-height / 2);
  right: 0;
  text-align: center;
  writing-mode: vertical-rl;
  padding: 2rem 0.5rem;
  background-color: lightseagreen;
  color: white;
  border-radius: 6px 0 0 6px;
  font-size: 1.1rem;
  font-weight: bold;
  white-space: nowrap;
  transform: translate3d(0, -50%, 0);
  transition: background-color 0.25s linear;
  box-shadow: -1px 1px 8px rgba($gray-darken3, 0.4);
  cursor: pointer;
  &::after {
    content: 'ご予約はこちら';
  }
  &:hover {
    background-color: $link-normal2;
  }

  @media only screen and (max-width: $grid-breakpoint-md) {
    top: 0;
    height: calc($nav-header-height - 22px);
    padding: 0 6px;
    border-radius: 0 0 0 6px;
    transform: translate3d(0, 0, 0);
    box-shadow: none;
    &::after {
      content: 'ご予約';
    }
  }
}
</style>
