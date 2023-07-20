<script setup lang="ts">
import type { ImageSetting } from '@/types/image-settings'

type EyeCatchImageProps = {
  image?: ImageSetting
}
const {
  image = {
    url: '',
    lgSize: 'cover',
    smSize: 'cover',
    lgPosition: 'center',
    smPosition: 'center',
    lgParallax: 'scroll',
    smParallax: 'scroll',
  },
} = defineProps<EyeCatchImageProps>()
</script>

<template>
  <div
    class="eyecatch-image"
    :style="{
      '--background-image': `url(${image.url})`,
      '--background-size-lg': image.lgSize,
      '--background-size-sm': image.smSize,
      '--background-position-lg': image.lgPosition,
      '--background-position-sm': image.smPosition,
      '--background-parallax-lg': image.lgParallax,
      '--background-parallax-sm': image.smParallax,
    }"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.eyecatch-image {
  height: 100%;
  background-repeat: no-repeat;
  background-image: var(--background-image);
  background-size: var(--background-size-lg);
  background-position: var(--background-position-lg);
  background-attachment: var(--background-parallax-lg);
}

@media only screen and (max-width: $grid-breakpoint-md) {
  .eyecatch-image {
    background-size: var(--background-size-sm);
    background-position: var(--background-position-sm);
    background-attachment: var(--background-parallax-sm);
  }
}
</style>
