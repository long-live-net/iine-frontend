<script setup lang="ts">
import type { ImageSettings } from '@/types/image-settings'

type EyeCatchImageProps = {
  url: string
  settings?: ImageSettings
  circle?: boolean
  round?: boolean
}
const {
  settings = {
    lgSize: 'cover',
    smSize: 'cover',
    lgPosition: 'center',
    smPosition: 'center',
    lgParallax: 'scroll',
    smParallax: 'scroll',
  },
  circle = false,
  round = false,
} = defineProps<EyeCatchImageProps>()
</script>

<template>
  <div
    class="eyecatch-image"
    :class="{ circle: circle, round: round }"
    :style="{
      '--background-image': `url(${url})`,
      '--background-size-lg': settings.lgSize,
      '--background-size-sm': settings.smSize,
      '--background-position-lg': settings.lgPosition,
      '--background-position-sm': settings.smPosition,
      '--background-parallax-lg': settings.lgParallax,
      '--background-parallax-sm': settings.smParallax,
    }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.eyecatch-image {
  background-repeat: no-repeat;
  background-image: var(--background-image);
  background-size: var(--background-size-lg);
  background-position: var(--background-position-lg);
  background-attachment: var(--background-parallax-lg);
}
.circle {
  border-radius: 50%;
  overflow: hidden;
}
.round {
  border-radius: 12px;
  overflow: hidden;
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .eyecatch-image {
    background-size: var(--background-size-sm);
    background-position: var(--background-position-sm);
    background-attachment: var(--background-parallax-sm);
  }
}
</style>
