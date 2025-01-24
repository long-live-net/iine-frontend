<script setup lang="ts">
import type { ImageSettings } from '@/types/content'

type EyeCatchImageProps = {
  url?: string
  settings?: ImageSettings
  circle?: boolean
  round?: boolean
}
const props = withDefaults(defineProps<EyeCatchImageProps>(), {
  url: '',
  settings: () => ({
    lgSize: 'cover',
    smSize: 'cover',
    lgPosition: 'center',
    smPosition: 'center',
    lgParallax: 'scroll',
    smParallax: 'scroll',
  }),
  circle: false,
  round: false,
})

const noImage = '/images/no-image-g.png'
const { isSmall, isJudged } = useMediaQueryIsSmall()
type ImageOptions = {
  src: string
  size: string | 'cover'
  position: string | 'center'
  parallax: 'fixed' | 'scroll'
}
const imageOptions = computed<ImageOptions>(() =>
  isJudged.value && isSmall.value
    ? {
        src: `url(${props.url.length ? props.url : noImage})`,
        size: props.settings.smSize,
        position: props.settings.smPosition,
        parallax: props.settings.smParallax,
      }
    : {
        src: `url(${props.url.length ? props.url : noImage})`,
        size: props.settings.lgSize,
        position: props.settings.lgPosition,
        parallax: props.settings.lgParallax,
      }
)
const isParallax = computed(() => imageOptions.value.parallax === 'fixed')
</script>

<template>
  <div
    class="eyecatch-image"
    :class="{
      parallax: isParallax,
      normal: !isParallax,
      circle: circle,
      round: round,
    }"
  >
    <slot />
    <div v-if="$slots.settings" class="settings">
      <slot name="settings" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.eyecatch-image {
  position: relative;

  .settings {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
  }
}

.normal {
  background-repeat: no-repeat;
  background-image: v-bind('imageOptions.src');
  background-size: v-bind('imageOptions.size');
  background-position: v-bind('imageOptions.position');
  background-attachment: v-bind('imageOptions.parallax');
}

.parallax {
  clip-path: inset(0);

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-repeat: no-repeat;
    background-image: v-bind('imageOptions.src');
    background-size: v-bind('imageOptions.size');
    background-position: v-bind('imageOptions.position');
  }
}

.circle {
  clip-path: inset(0 round 50%) !important;
}

.round {
  clip-path: inset(0 round 12px) !important;
}
</style>
