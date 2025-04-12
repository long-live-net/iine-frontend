<script setup lang="ts">
defineProps<{ reservationUrl: string | null }>()
</script>

<template>
  <div class="reservation-side-chip g-block-lg">
    <CommonReservationChip :url="reservationUrl" class="reservation-button"
      >予約する</CommonReservationChip
    >
  </div>
</template>

<style lang="scss" scoped>
.reservation-side-chip {
  z-index: 1001;
  position: fixed;
  top: calc(50% + $nav-header-height / 2);
  right: 0;
  transform: translate3d(0, -50%, 0);

  .reservation-button {
    writing-mode: vertical-rl;
    letter-spacing: 4px;
    padding: 0 6px;
    height: 10rem;
    font-size: 1.1rem;
    border-radius: 8px 0 0 8px;
    box-shadow: -1px 1px 3px rgba($gray-darken3, 0.25);
  }
}
</style>
